var syncApps = [
    // PM Modular Apps - uncomment as per need
    // "ZUI_NAD_MDS_FUNCTIONAL_LOC",
    "ZUI_NAD_MDS_MATERIAL",
    // "ZUI_NAD_MDS_PLANT",
    // "ZUI_NAD_PM_WORK_ORDER_LIST",
    // "ZUI_NAD_PM_NOTIFICATION_LIST",

    // "ZUI_NAD_MDS_MEASURE_POINT",
    // "ZUI_NAD_MDS_WBS",
    // "ZUI_NAD_PM_NOTIFICATION_DOC",

    // SD Modular Apps - uncomment as per need
    // "ZUI_NAD_SD_SALES_ORDER_DOC",
    // "ZUI_NAD_MDS_CUSTOMER",

];

var localGUID = AppCache.LoadOptions.appGUID;
var syncQueue = [];

// Sorter
var oSorter1 = new sap.ui.model.Sorter("CATEGORY", false, true);
var oSorter2 = new sap.ui.model.Sorter("DESCR", false, false);
var binding = tabSync.getBinding("items");
binding.sort([oSorter1, oSorter2]);


if (sap.n) {

    // Namespace
    if (!sap.n.Database) {
        sap.n.Database = {};
    }

    // Subscribe
    sap.n.Database.Subscribe = function(applid, descr, category, funcSync) {

        var appData = ModelData.Find(tabSync, "APPLID", applid)[0] || {};
        appData.APPLID = applid;
        appData.DESCR = descr;
        appData.CATEGORY = category;
        appData.FUNCSYNC = funcSync;
        appData.BUSY = false;

        ModelData.Update(tabSync, "APPLID", appData.APPLID, appData);
        modeltabSync.refresh();
        setCachetabSync();

        var oSorter1 = new sap.ui.model.Sorter("CATEGORY", false, true);
        var oSorter2 = new sap.ui.model.Sorter("DESCR", false, false);
        var binding = tabSync.getBinding("items");
        binding.sort([oSorter1, oSorter2]);

        appsLoaded++;
        if (appsLoaded === appsTotal) {
            butStartSync.setEnabled(true);
        }
    };

    // AjaxSuccess
    sap.n.Database.AfterUpdate = function(applid, quantity, unit) {

        ModelData.UpdateField(tabSync, "APPLID", applid, "BUSY", false);
        ModelData.UpdateField(tabSync, "APPLID", applid, "QUANTITY", quantity);
        ModelData.UpdateField(tabSync, "APPLID", applid, "UNIT", unit);
        ModelData.UpdateField(tabSync, "APPLID", applid, "STAT_ICON", "sap-icon://accept");
        ModelData.UpdateField(tabSync, "APPLID", applid, "STAT_COLOR", "#007833");

        var newDate = new Date();
        var outDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: "E dd.MM.yyyy"
        });
        var outTime = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: "HH:mm"
        });
        var syncDate = outDate.format(newDate);
        var syncTime = outTime.format(newDate);

        ModelData.UpdateField(tabSync, "APPLID", applid, "SYNC_DATE", syncDate);
        ModelData.UpdateField(tabSync, "APPLID", applid, "SYNC_TIME", syncTime);

        modeltabSync.refresh();
        setCachetabSync();
        doSync();

        // Save to Global DB
        AppDB.transaction(function(tx) {
            tx.executeSql('INSERT OR REPLACE INTO IT_GLOBAL_SYNC ("APPLID") VALUES ("' + applid + '")');
        });
    };

    // AjaxError
    sap.n.Database.AjaxError = function(applid, quantity, unit) {
        ModelData.UpdateField(tabSync, "APPLID", applid, "BUSY", false);
        ModelData.UpdateField(tabSync, "APPLID", applid, "QUANTITY", quantity);
        ModelData.UpdateField(tabSync, "APPLID", applid, "UNIT", unit);
        ModelData.UpdateField(tabSync, "APPLID", applid, "STAT_ICON", "sap-icon://error");
        ModelData.UpdateField(tabSync, "APPLID", applid, "STAT_COLOR", "#cc1919");
        modeltabSync.refresh();
        setCachetabSync();
        doSync();
    };
}
