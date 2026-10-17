# Security Specification for KG Recall

## 1. Data Invariants
1. A user profile document `/users/{userId}` can only be read, created, or updated by the authenticated user whose `request.auth.uid == userId`.
2. A folder `/users/{userId}/folders/{folderId}` can only be accessed or modified by the user matching `userId == request.auth.uid`.
3. A flashcard `/users/{userId}/cards/{cardId}` must belong strictly to the authenticated user matching `userId == request.auth.uid`.
4. Creation operations require immutable identity binding: `incoming().userId == request.auth.uid`.
5. Update operations cannot alter ownership: `incoming().userId == existing().userId`.
6. String lengths must adhere to bounded limits (`username <= 50`, `folder.name <= 100`, `question <= 3000`, `answer <= 3000`).
7. No unauthorized third-party user may read or list documents in another user's paths.

## 2. The Dirty Dozen Payloads (Targeting Vulnerabilities)
1. **Unauthenticated Read on Profile**: An unauthenticated client requests `/users/target_user`. Expectation: PERMISSION_DENIED.
2. **Spoofed User Creation**: User `attacker` tries to create `/users/victim` with `id: 'victim'`. Expectation: PERMISSION_DENIED.
3. **ID Injection in Folder Path**: User tries to create `/users/{userId}/folders/` with path ID longer than 128 characters or containing illegal characters. Expectation: PERMISSION_DENIED.
4. **Cross-User Folder Creation**: User `alice` tries to write to `/users/bob/folders/f1`. Expectation: PERMISSION_DENIED.
5. **Cross-User Card Injection**: User `alice` creates `/users/bob/cards/c1`. Expectation: PERMISSION_DENIED.
6. **Card Ownership Mutation**: User tries to update `userId` on existing card to transfer ownership. Expectation: PERMISSION_DENIED.
7. **Giant Payload / Resource Exhaustion**: Injecting a 2MB question string in a card write. Expectation: PERMISSION_DENIED.
8. **Invalid Enum in Theme Accent**: User attempts to set `accentColor: 'hacked_color'`. Expectation: PERMISSION_DENIED.
9. **Unverified User Write Attempt**: User without verified email attempts state mutation.
10. **Ghost Field Poisoning**: Inserting unexpected administrative keys `isAdmin: true` into `UserProfile`. Expectation: PERMISSION_DENIED.
11. **Negative Card Count / Negative Lesson ID**: Setting `lessonId: -5` or `lessonId: 99`. Expectation: PERMISSION_DENIED.
12. **Client-side Read of Foreign Folders via Collection Query**: A user lists another user's subcollections. Expectation: PERMISSION_DENIED.
