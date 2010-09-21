var pseudo_id = null;
var flexip = null;
var myFjsApi = null;

var config = {
  image: null,
  toolbars_url: null,
  layers_url: null,
  modules: {
    comm: 'modules/comm/sicar/communication.swf',
    background: null,
    sideMenu: 'modules/SideMenuSicar.swf',
    skin: 'skins/default/skin.swf'
  }
};

function loadFlexip() {
  if(pseudo_id) {
    $.get(config_url+pseudo_id, function(response) {
      if(response.error) alert("Error: "+response.error);
      else {
        config.modules.background = response.data.modules.background;
        config.toolbars_url = response.data.toolbars_url;
        config.layers_url = response.data.layers_url;
        config.image = response.data.image;
        launchFlexip();
      }
    }, 'json');
  }
}

function launchFlexip() {
  /// Flexip could be already loaded;
  ///  if it is, for now, reload everything.
  flexip_id = 'flexip';
  if($("#flexip-loaded").length) flexip_id = "flexip-loaded";
  myFjsApi = new FJSAPI('myFjsApi',
                            'flexip-loaded',
                            flexip_id,
                            '100%',
                            '100%',
                            '9.0.0',
                            '/flexip/'+config.modules.comm+'?anticache='+(new Date()).getTime(),
                            '/flexip/'+config.modules.background+'?anticache='+(new Date()).getTime(),
                            '/flexip/'+config.modules.sideMenu+'?anticache='+(new Date()).getTime(),
                            '/flexip/'+config.modules.skin+'?anticache='+(new Date()).getTime());

  myFjsApi.allModulesLoaded = (typeof(allModulesLoaded) != "undefined") ? allModulesLoaded : function() {
    this.flexipRef.commLoadInterfaceSettings(config.toolbars_url);
    this.flexipRef.imageLoadSource(config.image);
  }

  myFjsApi.imageLoaded = (typeof(imageLoaded) != "undefined") ? imageLoaded: function() {
    this.flexipRef.commLoadData(config.layers_url);
  }

  myFjsApi.commDataParseEnd = (typeof(dataParseEnd) != "undefined") ? dataParseEnd : function() {
    firefoxBugFix();
    this.flexipRef.messageBoxHide();
  }

  myFjsApi.toolBarButtonClick = toolBarButtonClick;
  myFjsApi.layerOperationPerformed = layerButtonClick;

/*
  myFjsApi.moduleLoaded = function(moduleCode) {console.warn("Module loaded: "+moduleCode)}
  myFjsApi.skinLoaded = function() {console.warn("Skin loaded");}
  myFjsApi.skinLoadError = function(e) {console.error("skinLoadError: "+e)}
  myFjsApi.communicationModuleLoadError = function(e) {console.error("communicationModuleLoadError: "+e)}
  myFjsApi.sideMenuModuleLoadError = function(e) {console.error("sideMenuModuleLoadError: "+e)}
  myFjsApi.commInterfaceSettingsLoadError = function(e) {console.error("commInterfaceSettingsLoadError: "+e)}
  myFjsApi.commDataLoadError = function(e) {console.error("commDataLoadError: "+e)}
  myFjsApi.commDataParseError = function(e) {console.error("commDataParseError: "+e)}
  myFjsApi.imageModLoadError = function(e) {console.error("imageModLoadError: "+e)}
  myFjsApi.imageMetadataLoadError = function(e) {console.error("imageMetadataLoadError: "+e)}
  myFjsApi.imageLoadError = function(e) {console.error("imageLoadError: "+e)}
*/

  myFjsApi.initialize();
  flexip = myFjsApi.flexipRef;
}

function firefoxBugFix() {
  var img = new Image();
  img.src = '/images/rails.png';
}
