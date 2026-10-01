/**
 * character-studio-core
 *
 * An executable form of the Character Studio knowledge base in
 * ../character-studio-kb/. The research lives there; this encodes the subset
 * that can be expressed as enforced constraints.
 *
 * Build order follows kb 90 §11: prohibitions, do-not-flag, budget, silence,
 * then genre filters. Educator surfaces are intentionally absent.
 */

export * from './bands.js';
export * from './prohibitions.js';
export * from './doNotFlag.js';
export * from './budget.js';
export * from './feedback.js';
export * from './genre.js';
export * from './engine.js';
