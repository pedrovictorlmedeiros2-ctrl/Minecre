const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'projects.json');

function load() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function save(projects) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}

function addProject({ channelId, name, repoUrl, guildId }) {
  const projects = load();
  projects[channelId] = { name, repoUrl, guildId, createdAt: new Date().toISOString() };
  save(projects);
  return projects[channelId];
}

function getProjectByChannel(channelId) {
  const projects = load();
  return projects[channelId] || null;
}

function listProjects() {
  return load();
}

module.exports = { addProject, getProjectByChannel, listProjects };
