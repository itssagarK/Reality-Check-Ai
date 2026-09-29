import { SavedAudit, UserInput } from '../types';

/**
 * Get or compute a stable project identifier for grouping iterations
 */
export function getProjectId(audit: { id?: string; projectId?: string; userInput: UserInput }): string {
  if (audit.projectId) return audit.projectId;
  if (audit.userInput.projectId) return audit.userInput.projectId;
  
  if (audit.userInput.projectName && audit.userInput.projectName.trim().length > 0) {
    return 'proj_' + audit.userInput.projectName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  // Fallback: derive key from the first 40 alphanumeric characters of the plan
  const cleanPlan = (audit.userInput.plan || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 32);
  
  return cleanPlan ? `proj_${cleanPlan}` : (audit.id ? `proj_${audit.id}` : 'proj_default');
}

/**
 * Get a friendly human-readable project title
 */
export function getProjectTitle(audit: { projectId?: string; userInput: UserInput }): string {
  if (audit.userInput.projectName && audit.userInput.projectName.trim().length > 0) {
    return audit.userInput.projectName.trim();
  }

  const planText = (audit.userInput.plan || '').trim();
  if (!planText) return 'Untitled Project';

  // Take the first sentence or first 45 characters
  const firstSentence = planText.split(/[\n.!?]/)[0].trim();
  if (firstSentence.length <= 45) {
    return firstSentence;
  }
  return firstSentence.slice(0, 42).trim() + '...';
}

/**
 * Group audits by project ID
 */
export function groupAuditsByProject(audits: SavedAudit[]): Map<string, SavedAudit[]> {
  const map = new Map<string, SavedAudit[]>();

  // Sort chronological first so iterations are in order
  const sorted = [...audits].sort((a, b) => a.timestamp - b.timestamp);

  sorted.forEach((audit) => {
    const pId = getProjectId(audit);
    const list = map.get(pId) || [];
    list.push(audit);
    map.set(pId, list);
  });

  return map;
}

/**
 * Get all iterations for the same project, sorted chronologically
 */
export function getProjectIterations(
  currentAudit: { id?: string; projectId?: string; userInput: UserInput },
  allAudits: SavedAudit[]
): SavedAudit[] {
  const currentPId = getProjectId(currentAudit);
  return allAudits
    .filter((a) => getProjectId(a) === currentPId)
    .sort((a, b) => a.timestamp - b.timestamp);
}
