var appsLoaded = 0;
var appsTotal = syncApps.length;

function loadApps() {

    oInfoSync.setNumber(appsTotal);

    $.each(syncApps, function(i, data) {
        AppCache.Load(data, {
            load: "init"
        });
    });
}


function startSync() {

    // Set All Busy
    $.each(modeltabSync.oData, function(i, data) {
        if (data.FUNCSYNC && data.SELECTED) {
            ModelData.UpdateField(tabSync, "APPLID", data.APPLID, "BUSY", true);
            ModelData.UpdateField(tabSync, "APPLID", data.APPLID, "STAT_ICON", "");
            syncQueue.push(data.APPLID);

        }
    });

    // Update Model
    modeltabSync.refresh();

    // Start Sync Queue
    doSync();

}


function doSync() {

    var applid = syncQueue[0];

    if (applid) {

        // Initialise DB
        var initDB = "sap.n.Database." + applid;
        if (typeof eval(initDB) === "object") {
            eval(initDB + ".Init()");
        }

        // Trigger Sync
        var syncFunc = ModelData.Find(tabSync, "APPLID", applid)[0];

        if (syncFunc) {
            AppCache.CurrentApp = applid;
            syncFunc.FUNCSYNC();
        }

        // Remove
        syncQueue.splice(0, 1);

    } else {

        var numberOK = 0;
        $.each(modeltabSync.oData, function(i, data) {
            numberOK = numberOK + parseInt(data.QUANTITY);
        });

        var rec = {};
        rec.GUID = localGUID;

        // Data OK
        rec.TILE_VALUE1 = numberOK;
        rec.TILE_COLOR1 = "Good";
        rec.TILE_TITLE1 = "Disconnected Data";

        // // Outbox
        // //rec.TILE_VALUE2 = "0";
        // rec.TILE_COLOR2 = "Neutral";
        // rec.TILE_TITLE2 = "Outbox";

        // // Error
        // //rec.TILE_VALUE3 = "0";
        // rec.TILE_COLOR3 = "Critical";
        // rec.TILE_TITLE3 = "Error";

        rec.TILE_FOOTER = new Date().toString().slice(0, 24);
        sap.n.Launchpad.UpdateTileInfo(rec);
    }

}
