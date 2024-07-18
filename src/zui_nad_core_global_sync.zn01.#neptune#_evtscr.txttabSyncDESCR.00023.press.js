var context = oEvent.oSource.getBindingContext();

AppCache.Load(context.getProperty("APPLID"), {
    dialogShow: true,
    dialogTitle: context.getProperty("DESCR")
});

