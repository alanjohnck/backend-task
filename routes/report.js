const express = require('express');
const router = express.Router();
const companies = require('../data/data');

function isWithinDateRange(date, startDate, endDate) {
  if (!startDate && !endDate) return true; 
  const activityDate = new Date(date);
  if (startDate && activityDate < new Date(startDate)) return false;
  if (endDate && activityDate > new Date(endDate)) return false;
  return true;
}

// OVERVIEW 
router.get('/overview', (req, res) => {
  const { startDate, endDate } = req.query;

  const totalCompanies = companies.length;

  const totalTeams = companies.reduce((count, company) => count + company.teams.length, 0);

  let totalMembers = 0;
  let totalActivities = 0;
  let totalHours = 0;
  const activityMap = {};

  companies.forEach(company => {
    company.teams.forEach(team => {
      totalMembers += team.members.length;
      team.members.forEach(member => {
        const filteredActivities = member.activities.filter(a => isWithinDateRange(a.date, startDate, endDate));
        totalActivities += filteredActivities.length;
        filteredActivities.forEach(activity => {
          totalHours += activity.hours;
          activityMap[activity.type] = (activityMap[activity.type] || 0) + activity.hours;
        });
      });
    });
  });

  const topActivityTypes = Object.entries(activityMap)
    .map(([type, totalHours]) => ({ type, totalHours }))
    .sort((a, b) => b.totalHours - a.totalHours);

  res.json({
    totalCompanies,
    totalTeams,
    totalMembers,
    totalActivities,
    totalHours,
    topActivityTypes
  });
});

// COMPANY
router.get("/company/:companyId", (req, res) => {
  const { companyId } = req.params;
  const { startDate, endDate } = req.query;

  const company = companies.find(c => c.companyId === companyId);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const teams = company.teams.map(team => {
    const allActivities = team.members.flatMap(member =>
      member.activities.filter(a => isWithinDateRange(a.date, startDate, endDate))
    );

    const totalHours = allActivities.reduce((sum, act) => sum + act.hours, 0);
    const activityMap = {};
    const tagSet = new Set();

    allActivities.forEach(activity => {
      activityMap[activity.type] = (activityMap[activity.type] || 0) + activity.hours;
      activity.tags.forEach(tag => tagSet.add(tag));
    });

    const activityBreakdown = Object.entries(activityMap).map(([type, totalHours]) => ({
      type,
      totalHours
    }));

    return {
      teamId: team.teamId,
      teamName: team.name,
      totalMembers: team.members.length,
      totalHours,
      activityBreakdown,
      uniqueTags: Array.from(tagSet)
    };
  });

  res.json({
    companyId: company.companyId,
    companyName: company.name,
    teams
  });
});

// ==================== MEMBER ====================
router.get("/member/:memberId", (req, res) => {
  const { memberId } = req.params;
  const { startDate, endDate } = req.query;

  const member = companies
    .flatMap(company => company.teams)
    .flatMap(team => team.members)
    .find(x => x.memberId === memberId);

  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  const filteredActivities = member.activities.filter(a => isWithinDateRange(a.date, startDate, endDate));
  const totalHours = filteredActivities.reduce((sum, activity) => sum + activity.hours, 0);
  const dailyMap = {};

  filteredActivities.forEach(activity => {
    const { date, type, hours } = activity;
    if (!dailyMap[date]) {
      dailyMap[date] = { date, activities: [], hours: 0 };
    }
    dailyMap[date].activities.push(type);
    dailyMap[date].hours += hours;
  });

  res.json({
    memberId: member.memberId,
    name: member.name,
    totalHours,
    dailyBreakdown: Object.values(dailyMap),
  });
});

module.exports = router;
