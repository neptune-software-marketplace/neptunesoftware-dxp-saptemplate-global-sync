
AppCache.isOffline = !this.getState();

if (AppCache.isOffline) {
    onOffline();
} else {
    onOnline();
}
