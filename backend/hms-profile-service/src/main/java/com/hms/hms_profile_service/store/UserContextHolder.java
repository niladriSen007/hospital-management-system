package com.hms.hms_profile_service.store;

public class UserContextHolder {
    private static final ThreadLocal<String> currentUserId  = new ThreadLocal<>();

    public static void setCurrentUserId(String userId) {
        currentUserId .set(userId);
    }

    public static String getCurrentUserId() {
        return currentUserId.get();
    }

    public static void clear() {
        currentUserId.remove();
    }
}
