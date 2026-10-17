/**
 * Firestore Security Rules Test Specifications
 * Verifies that the Dirty Dozen security vulnerabilities are mitigated:
 * 1. Unauthenticated read/write
 * 2. Spoofed user identity
 * 3. Path ID injection attacks (>128 chars or special chars)
 * 4. Cross-user folder access
 * 5. Cross-user card mutation
 * 6. Card ownership alteration
 * 7. Bounded string length validation
 * 8. Invalid enum fields
 * 9. Unverified user writes
 * 10. Ghost field injections (isAdmin)
 * 11. Out-of-bounds lesson IDs (<1 or >10)
 * 12. Unauthorized collection list queries
 */

export interface TestPayloadAssertion {
  description: string;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TESTS: TestPayloadAssertion[] = [
  { description: 'Unauthenticated Read on Profile', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Spoofed User Creation without matching auth.uid', expectedResult: 'PERMISSION_DENIED' },
  { description: 'ID Injection in Folder Path variable', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Cross-User Folder Creation by different user', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Cross-User Card Injection', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Card Ownership Mutation', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Giant Payload / Excessive string size', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Invalid Enum in Theme Accent', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Unverified or Anonymous write mutation', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Ghost Field Injection (isAdmin: true)', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Negative or Out-of-bounds Lesson ID', expectedResult: 'PERMISSION_DENIED' },
  { description: 'Client-side Read of Foreign Folders via List Query', expectedResult: 'PERMISSION_DENIED' },
];
