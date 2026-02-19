import { uuidv7 } from 'uuidv7';

export const MAIN_BRANCH_ID = 'br_00000000-0000-0000-0000-000000000000';

export function eventId(): string {
  return `evt_${uuidv7()}`;
}

export function branchId(): string {
  return `br_${uuidv7()}`;
}

export function ratingId(): string {
  return `rating_${uuidv7()}`;
}

export function optionId(): string {
  return `opt_${uuidv7()}`;
}

export function criterionId(): string {
  return `cri_${uuidv7()}`;
}

export function commitId(): string {
  return `commit_${uuidv7()}`;
}
