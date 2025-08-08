const express = require('express');
const router = express.Router();
const companies = require('../data/data');



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

module.exports = router;