/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Click.js
 * @requires OpenLayers/Handler/Hover.js
 * @requires OpenLayers/Request.js
 * @requires OpenLayers/Format/WMSGetFeatureInfo.js
 */

/**
 * Class: OpenLayers.Control.MapGuideGetFeatureInfo
 * The MapGuideGetFeatureInfo control uses a WMS query to get information about a point on the map.  The
 * information may be in a display-friendly format such as HTML, or a machine-friendly format such
 * as GML, depending on the server's capabilities and the client's configuration.  This control
 * handles click or hover events, attempts to parse the results using an OpenLayers.Format, and
 * fires a 'getfeatureinfo' event with the click position, the raw body of the response, and an
 * array of features if it successfully read the response.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.MapGuideGetFeatureInfo = OpenLayers.Class(OpenLayers.Control, {
		
		/**
		 * APIProperty: maxFeatures
		 * {Integer} Maximum number of features to return from a WMS query. This
		 *     sets the feature_count parameter on WMS GetFeatureInfo
		 *     requests.
		 */
		maxFeatures : 10,
		
		/** APIProperty: clickCallback
		 *  {String} The click callback to register in the
		 *      {<OpenLayers.Handler.Click>} object created when the hover
		 *      option is set to false. Default is "click".
		 */
		clickCallback : "click",
		
		/**
		 * Property: layers
		 * {Array(<OpenLayers.Layer.WMS>)} The layers to query for feature info.
		 *     If omitted, all map WMS layers with a url that matches this <url> or
		 *     <layerUrls> will be considered.
		 */
		layer : null,
		persist : 1,
		layerAttributeFilter : 3,
		/**
		 * Property: url
		 * {String} The URL of the WMS service to use.  If not provided, the url
		 *     of the first eligible layer will be used.
		 */
		url : null,
		
		/**
		 * APIProperty: handlerOptions
		 * {Object} Additional options for the handlers used by this control, e.g.
		 * (start code)
		 * {
		 *     "click": {delay: 100},
		 *     "hover": {delay: 300}
		 * }
		 * (end)
		 */
		handlerOptions : null,
		
		/**
		 * Property: handler
		 * {Object} Reference to the <OpenLayers.Handler> for this control
		 */
		handler : null,
		
		/**
		 * APIProperty: events
		 * {<OpenLayers.Events>} Events instance for listeners and triggering
		 *     control specific events.
		 *
		 * Register a listener for a particular event with the following syntax:
		 * (code)
		 * control.events.register(type, obj, listener);
		 * (end)
		 *
		 * Supported event types (in addition to those from <OpenLayers.Control.events>):
		 * beforegetfeatureinfo - Triggered before the request is sent.
		 *      The event object has an *xy* property with the position of the
		 *      mouse click or hover event that triggers the request.
		 * nogetfeatureinfo - no queryable layers were found.
		 * getfeatureinfo - Triggered when a GetFeatureInfo response is received.
		 *      The event object has a *text* property with the body of the
		 *      response (String), a *features* property with an array of the
		 *      parsed features, an *xy* property with the position of the mouse
		 *      click or hover event that triggered the request, and a *request*
		 *      property with the request itself. If drillDown is set to true and
		 *      multiple requests were issued to collect feature info from all
		 *      layers, *text* and *request* will only contain the response body
		 *      and request object of the last request.
		 */
		
		/**
		 * Constructor: <OpenLayers.Control.MapGuideGetFeatureInfo>
		 *
		 * Parameters:
		 * options - {Object}
		 */
		initialize : function (options) {
			options = options || {};
			options.handlerOptions = options.handlerOptions || {};
			
			OpenLayers.Control.prototype.initialize.apply(this, [options]);
			
			var callbacks = {};
			callbacks[this.clickCallback] = this.getInfoForClick;
			this.handler = new OpenLayers.Handler.Click(
					this, callbacks, this.handlerOptions.click || {});
		},
		
		/**
		 * Method: getInfoForClick
		 * Called on click
		 *
		 * Parameters:
		 * evt - {<OpenLayers.Event>}
		 */
		getInfoForClick : function (evt) {
			this.events.triggerEvent("beforegetfeatureinfo", {
				xy : evt.xy
			});
			// Set the cursor to "wait" to tell the user we're working on their
			// click.
			OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
			this.request(evt.xy, {});
		},
		
		/**
		 * Method: request
		 * Sends a GetFeatureInfo request to the WMS
		 *
		 * Parameters:
		 * clickPosition - {<OpenLayers.Pixel>} The position on the map where the
		 *     mouse event occurred.
		 * options - {Object} additional options for this method.
		 *
		 * Valid options:
		 * - *hover* {Boolean} true if we do the request for the hover handler
		 */
		request : function (clickPosition, options) {
			options = options || {};
			var projection = this.map.getProjection();
			var layerProj = this.layer.projection;
			if (layerProj && layerProj.equals(this.map.getProjectionObject())) {
				projection = layerProj.getCode();
			}
			var px = new OpenLayers.Pixel(clickPosition.x, clickPosition.y);
			var pos = this.map.getLonLatFromPixel(px);
			var radius = this.map.getResolution()*30;
			var params = {
				version : "1.0.0",
				locale : "en",
				clientagent : "rapport fra stedet",
				operation : "QUERYMAPFEATURES",
				session : this.layer.params.session,
				mapname : this.layer.params.mapname,
				geometry : OpenLayers.Geometry.Polygon.createRegularPolygon(new OpenLayers.Geometry.Point(pos.lon, pos.lat), radius, 4, 0).toString(),
				maxFeatures : -1,
				persist : 1,
				selectionVariant : 'INTERSECTS',
				layerAttributeFilter : 3
			};
			redline.addFeatures([
				new OpenLayers.Feature.Vector(
					OpenLayers.Geometry.Polygon.createRegularPolygon(new OpenLayers.Geometry.Point(pos.lon, pos.lat), radius, 4, 0))
			]);
			var info = {
				url : this.url,
				params : params,
				callback : function (request) {
					OpenLayers.ProxyHost = null;
					this.handleResponse(clickPosition, request, url);
				},
				scope : this
			};
			//OpenLayers.ProxyHost = "proxy.cgi?url=";
			//OpenLayers.ProxyHost = "http://query.yahooapis.com/v1/public/yql?q=select * from xml where url=";
			var request = OpenLayers.Request.GET(info);
			
		},
		
		/**
		 * Method: triggerGetFeatureInfo
		 * Trigger the getfeatureinfo event when all is done
		 *
		 * Parameters:
		 * request - {XMLHttpRequest} The request object
		 * xy - {<OpenLayers.Pixel>} The position on the map where the
		 *     mouse event occurred.
		 * features - {Array(<OpenLayers.Feature.Vector>)} or
		 *     {Array({Object}) when output is "object". The object has a url and a
		 *     features property which contains an array of features.
		 */
		triggerGetFeatureInfo : function (request, xy, features) {
			this.events.triggerEvent("getfeatureinfo", {
				text : request.responseText,
				features : features,
				request : request,
				xy : xy
			});
			
			// Reset the cursor.
			OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
		},
		
		/**
		 * Method: handleResponse
		 * Handler for the GetFeatureInfo response.
		 *
		 * Parameters:
		 * xy - {<OpenLayers.Pixel>} The position on the map where the
		 *     mouse event occurred.
		 * request - {XMLHttpRequest} The request object.
		 * url - {String} The url which was used for this request.
		 */
		handleResponse : function (xy, request, url) {
			var li = "";
			var doc = request.responseXML;
			if (doc && doc.documentElement) {
				for (var i = 0; i < doc.documentElement.childNodes.length; i++) {
					var node = doc.documentElement.childNodes[i];
					if (node.nodeName == 'Property') {
						var name = node.attributes['name'].value;
						var value = node.attributes['value'].value;
						li += "<li>" + name + ": " + value + "</li>";
					}
				}
				
			}
			if (li != "") {
				$("#infolist").empty().append(li).listview("refresh");
				$("#info").popup("open");
			}
			
		},
		
		CLASS_NAME : "OpenLayers.Control.MapGuideGetFeatureInfo"
	});
