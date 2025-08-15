/**
 * Lead State Machine Service
 * Manages the canonical lead flow with strict state transitions
 */

export type LeadState = 
  | "lead:intake"
  | "lead:nurture" 
  | "lead:qualified"
  | "assessment:scheduled"
  | "assessment:completed"
  | "crm:opportunity:created"
  | "nda:signed"
  | "vdr:opened"
  | "deal:loi"
  | "deal:dd"
  | "deal:won"
  | "deal:lost";

export const TERMINAL_STATES: LeadState[] = ["deal:won", "deal:lost"];

// Valid state transitions (forward-only)
export const STATE_TRANSITIONS: Record<LeadState, LeadState[]> = {
  "lead:intake": ["lead:nurture", "lead:qualified"],
  "lead:nurture": ["lead:qualified"],
  "lead:qualified": ["assessment:scheduled"],
  "assessment:scheduled": ["assessment:completed"],
  "assessment:completed": ["crm:opportunity:created"],
  "crm:opportunity:created": ["nda:signed"],
  "nda:signed": ["vdr:opened"],
  "vdr:opened": ["deal:loi"],
  "deal:loi": ["deal:dd"],
  "deal:dd": ["deal:won", "deal:lost"],
  "deal:won": [], // Terminal
  "deal:lost": [], // Terminal
};

export class LeadStateService {
  /**
   * Validate if state transition is allowed
   */
  static isValidTransition(fromState: LeadState, toState: LeadState): boolean {
    const allowedStates = STATE_TRANSITIONS[fromState];
    return allowedStates.includes(toState);
  }

  /**
   * Get next possible states for current state
   */
  static getNextStates(currentState: LeadState): LeadState[] {
    return STATE_TRANSITIONS[currentState] || [];
  }

  /**
   * Check if state is terminal
   */
  static isTerminalState(state: LeadState): boolean {
    return TERMINAL_STATES.includes(state);
  }

  /**
   * Validate state transition and throw if invalid
   */
  static validateTransition(fromState: LeadState, toState: LeadState): void {
    if (!this.isValidTransition(fromState, toState)) {
      throw new Error(
        `Invalid state transition: ${fromState} → ${toState}. ` +
        `Allowed transitions: ${STATE_TRANSITIONS[fromState].join(", ")}`
      );
    }
  }

  /**
   * Get state progression percentage (0-100)
   */
  static getProgressPercentage(state: LeadState): number {
    const stateOrder: LeadState[] = [
      "lead:intake",
      "lead:nurture", 
      "lead:qualified",
      "assessment:scheduled",
      "assessment:completed",
      "crm:opportunity:created",
      "nda:signed",
      "vdr:opened",
      "deal:loi",
      "deal:dd",
      "deal:won" // Use won as 100%
    ];
    
    const index = stateOrder.indexOf(state);
    if (index === -1) return 0;
    
    return Math.round((index / (stateOrder.length - 1)) * 100);
  }

  /**
   * Get human-readable state label
   */
  static getStateLabel(state: LeadState): string {
    const labels: Record<LeadState, string> = {
      "lead:intake": "Lead Intake",
      "lead:nurture": "Nurturing", 
      "lead:qualified": "Qualified",
      "assessment:scheduled": "Assessment Scheduled",
      "assessment:completed": "Assessment Complete",
      "crm:opportunity:created": "Opportunity Created",
      "nda:signed": "NDA Signed",
      "vdr:opened": "VDR Opened",
      "deal:loi": "LOI Stage",
      "deal:dd": "Due Diligence",
      "deal:won": "Closed Won",
      "deal:lost": "Closed Lost"
    };
    
    return labels[state] || state;
  }
}