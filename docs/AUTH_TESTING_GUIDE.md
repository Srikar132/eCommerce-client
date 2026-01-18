# Quick Testing Guide - Auth Flow Fixes

## 🧪 Critical Test Cases

### Test 1: Initial Page Load (Server Hydration)
**Expected:** Store should have user data immediately, no API call to `/auth/me`

1. Make sure you're logged in
2. Open DevTools → Network tab
3. Hard refresh the page (Ctrl+Shift+R)
4. Check console logs:
   ```
   [AuthProvider] ✅ Hydrating store with server data: {user object}
   ```
5. ✅ **PASS:** No API call to `/auth/me` on initial load
6. ❌ **FAIL:** If you see API call to `/auth/me`, hydration failed

---

### Test 2: Login Flow (No Race Condition)
**Expected:** Smooth navigation, store updates before render

1. Logout if logged in
2. Go to `/login`
3. Enter credentials and submit
4. Watch console logs:
   ```
   [Auth] Login successful, user stored: {user}
   ```
5. Navigate to home page
6. ✅ **PASS:** No flash of "Login" button, immediate user UI
7. ❌ **FAIL:** If you briefly see "Login" button then "Profile", race condition exists

---

### Test 3: Logout Flow (Error Handling)
**Expected:** Complete cleanup even if backend fails

1. Login first
2. Open DevTools → Network tab → Offline mode
3. Click logout
4. Watch console logs:
   ```
   [Auth] ❌ Backend logout failed: Network Error
   [Auth] ✅ Client-side cleanup complete
   ```
5. ✅ **PASS:** Redirected to login, localStorage cleared, store cleared
6. ❌ **FAIL:** If store still has user or stuck on page, cleanup failed

---

### Test 4: Smart Revalidation (No Redundant Calls)
**Expected:** No API calls for 2 minutes on protected routes

1. Login
2. Navigate to `/account`
3. Check console: `[AuthProvider] 🔐 Revalidating auth for sensitive route: /account`
4. Navigate away and back to `/account` within 2 minutes
5. Check console: `[AuthProvider] ⏭️ Skipping revalidation (recent check)`
6. ✅ **PASS:** No API call on second visit
7. ❌ **FAIL:** If API call happens every time, cooldown not working

---

### Test 5: Visibility Change Revalidation
**Expected:** Auth check only after 10+ min inactivity

1. Login
2. Note current time
3. Switch to another tab/app for 5 minutes
4. Return to the tab
5. Check console: Should NOT see auth check
6. Switch away for 15 minutes
7. Return to the tab
8. Check console: `[AuthProvider] 🔍 Revalidating auth after inactivity`
9. ✅ **PASS:** Auth checked only after 10+ min
10. ❌ **FAIL:** If checked immediately, cooldown broken

---

### Test 6: Middleware Token Refresh Sync
**Expected:** If middleware refreshes token, store should sync

1. Wait for access token to expire (15 min)
2. Navigate to any page
3. Middleware will refresh token
4. Check console in auth-provider:
   ```
   [AuthProvider] 🔄 Found refreshed session, hydrating store
   ```
5. ✅ **PASS:** Store updates with user data
6. ❌ **FAIL:** If UI shows "Login" even though cookies have valid token

---

### Test 7: Store Persistence Across Tabs
**Expected:** Login in one tab reflects in another

1. Open two tabs of your app
2. Login in Tab 1
3. Refresh Tab 2
4. ✅ **PASS:** Tab 2 shows logged in state
5. Logout in Tab 1
6. Refresh Tab 2
7. ✅ **PASS:** Tab 2 shows logged out state

---

### Test 8: Protected Route Access After Token Expiry
**Expected:** Redirect to login with session expiry message

1. Login
2. Wait for refresh token to expire (or manually delete cookies)
3. Try to access `/account`
4. Middleware should redirect to `/login`
5. ✅ **PASS:** Redirected to login
6. ❌ **FAIL:** If accessing protected content without valid token

---

## 🔍 Console Log Reference

### Expected Logs on Fresh Page Load (Logged In)
```
[AuthProvider] ✅ Hydrating store with server data: {id, email, role, emailVerified}
```

### Expected Logs on Fresh Page Load (Not Logged In)
```
[AuthProvider] ℹ️ No initial user from server, using persisted state
[AuthProvider] ℹ️ No active session found
```

### Expected Logs on Login
```
[Auth] Login successful, user stored: {user}
```

### Expected Logs on Logout
```
[Auth] Starting logout process...
[Auth] ✅ Backend logout successful
[Auth] ✅ Client-side cleanup complete
```

### Expected Logs on Sensitive Route
```
[AuthProvider] 🔐 Revalidating auth for sensitive route: /account
[AuthProvider] ✅ Auth still valid
```

### Expected Logs on Repeat Visit (Within 2 min)
```
[AuthProvider] ⏭️ Skipping revalidation (recent check)
```

### Expected Logs on Session Expiry
```
[AuthProvider] ❌ Session expired, logging out
```

---

## 🐛 Common Issues & Solutions

### Issue: Store not hydrating on page load
**Symptom:** `initialUser` is null even when logged in
**Check:**
1. Look at `layout.tsx` - is `getServerAuth()` being called?
2. Check middleware - is it setting cookies correctly?
3. Check browser cookies - do `accessToken` and `refreshToken` exist?

**Solution:** Middleware or backend might not be setting cookies properly

---

### Issue: Flash of unauthenticated content
**Symptom:** Briefly see "Login" button then "Profile"
**Check:** Console logs - is store being hydrated on mount?

**Solution:** 
- Check `auth-provider.tsx` - `hasHydratedRef` should prevent double hydration
- Check `use-auth.ts` login function - should have `await new Promise(resolve => setTimeout(resolve, 0))`

---

### Issue: Too many API calls to `/auth/me`
**Symptom:** Network tab shows repeated calls every few seconds
**Check:** Look for intervals or useEffect without proper dependencies

**Solution:** Already fixed - check console for:
- `⏭️ Skipping revalidation (recent check)` messages

---

### Issue: Logout doesn't work
**Symptom:** User appears logged out but can still access protected routes
**Check:**
1. Network tab - is `/auth/logout` API being called?
2. Cookies - are they being cleared?
3. localStorage - is `auth-storage` being removed?

**Solution:** Backend might not be clearing cookies properly

---

## 📊 Performance Metrics

### Before Fixes
- Initial page load: 2-3 API calls
- Every 5 minutes: 1 API call
- Navigate to `/account`: 1 API call
- Navigate to `/checkout`: 1 API call
- **Total per session (30 min):** ~15-20 API calls

### After Fixes
- Initial page load: 0 API calls (uses server data)
- Every 5 minutes: 0 API calls (removed interval)
- Navigate to `/account`: 1 API call (first time only)
- Navigate to `/checkout`: 1 API call (first time only)
- **Total per session (30 min):** ~2-3 API calls

**Improvement: 80-90% reduction in API calls**

---

## ✅ Checklist for Production

Before deploying to production, verify:

- [ ] All console logs show expected messages
- [ ] No errors in browser console
- [ ] No TypeScript errors in terminal
- [ ] Login flow works smoothly (no FOUC)
- [ ] Logout clears all data
- [ ] Protected routes enforce auth
- [ ] Token refresh works automatically
- [ ] Store persists across page refreshes
- [ ] Multi-tab sync works
- [ ] API calls reduced significantly
- [ ] Network errors handled gracefully
- [ ] Session expiry redirects to login

---

## 🚀 Next Steps

1. **Run through all test cases** above
2. **Monitor API calls** in Network tab (should be minimal)
3. **Check error logs** in production after deployment
4. **Set up monitoring** for auth failures (Sentry, LogRocket)
5. **Review auth metrics** after 1 week (login success rate, session duration)

---

## 💡 Tips for Debugging

### Enable Verbose Logging
Already enabled! Look for these emoji prefixes:
- ✅ = Success
- ❌ = Error
- 🔍 = Checking/Validating
- 🔄 = Syncing/Refreshing
- ⏭️ = Skipping
- ℹ️ = Info
- 🔐 = Security action

### Browser DevTools
1. **Console:** All auth logs are prefixed with `[Auth]` or `[AuthProvider]`
2. **Network:** Filter by `/auth/` to see all auth API calls
3. **Application → Cookies:** Check `accessToken` and `refreshToken`
4. **Application → Local Storage:** Check `auth-storage`
5. **Redux DevTools:** Won't work (we use Zustand), use Zustand DevTools extension instead

### React DevTools
1. Find `AuthProvider` component
2. Check its state (should see `isAuthenticated: true` if logged in)
3. Look for re-renders (should be minimal)

---

Good luck with testing! 🎉
