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

router.post('/add-activity', (req, res) => {
  const { memberId, date, type, hours, tags } = req.body;

  if (!memberId || !date || !type || !hours || !Array.isArray(tags)) {
    return res.status(400).json({ 
      error: 'Missing required fields: memberId, date, type, hours, tags' 
    });
  }

  if (typeof hours !== 'number' || hours <= 0) {
    return res.status(400).json({ 
      error: 'Hours must be a positive number' 
    });
  }

  let foundMember = null;
  let foundTeam = null;
  let foundCompany = null;

  for (const company of companies) {
    for (const team of company.teams) {
      const member = team.members.find(m => m.memberId === memberId);
      if (member) {
        foundMember = member;
        foundTeam = team;
        foundCompany = company;
        break;
      }
    }
    if (foundMember) break;
  }

  if (!foundMember) {
    return res.status(404).json({ error: 'Member not found' });
  }

  const newActivity = {
    date,
    type,
    hours: Number(hours),
    tags: Array.isArray(tags) ? tags : [tags]
  };

  // Add activity to member
  foundMember.activities.push(newActivity);

  res.status(201).json({
    message: 'Activity added successfully',
    activity: newActivity,
    member: {
      memberId: foundMember.memberId,
      name: foundMember.name,
      teamName: foundTeam.name,
      companyName: foundCompany.name
    }
  });
});
// ==================== COMPANY ====================
router.get("/company/:companyId", (req, res) => {
  const { companyId } = req.params;
  const { startDate, endDate } = req.query;

  const company = companies.find(c => c.companyId === companyId);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }

  // Collect all activities across all teams for activity summary
  const allCompanyActivities = [];
  const activitySummaryMap = {};

  const teams = company.teams.map(team => {
    const allActivities = team.members.flatMap(member =>
      member.activities.filter(a => isWithinDateRange(a.date, startDate, endDate))
    );

    // Add to company-wide activities for summary
    team.members.forEach(member => {
      const memberActivities = member.activities.filter(a => isWithinDateRange(a.date, startDate, endDate));
      memberActivities.forEach(activity => {
        allCompanyActivities.push({ ...activity, memberId: member.memberId });
      });
    });

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

  // Create activity summary by type across all teams
  allCompanyActivities.forEach(activity => {
    if (!activitySummaryMap[activity.type]) {
      activitySummaryMap[activity.type] = {
        totalHours: 0,
        members: new Set()
      };
    }
    activitySummaryMap[activity.type].totalHours += activity.hours;
    activitySummaryMap[activity.type].members.add(activity.memberId);
  });

  // Convert to final format
  const activitySummaryByType = {};
  Object.entries(activitySummaryMap).forEach(([type, data]) => {
    activitySummaryByType[type] = {
      totalHours: data.totalHours,
      members: data.members.size
    };
  });

  res.json({
    activitySummaryByType
  });
});

module.exports = router;