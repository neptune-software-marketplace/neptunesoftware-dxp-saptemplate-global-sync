class zcl_nad_core_global_sync definition
  public
  final
  create public .

public section.

  interfaces /neptune/if_nad_server .

  types:
    begin of ty_global_sync,
          selected   type string,
          applid     type string,
          category   type string,
          descr      type string,
          funcsync   type string,
          quantity   type string,
          unit       type string,
          busy       type boolean,
          sync_date  type string,
          sync_time  type string,
          stat_icon  type string,
          stat_color type string,
    end of ty_global_sync .

  data it_global_sync type standard table of ty_global_sync.
  data wa_global_sync type ty_global_sync .
protected section.
private section.
ENDCLASS.



CLASS ZCL_NAD_CORE_GLOBAL_SYNC IMPLEMENTATION.
ENDCLASS.
