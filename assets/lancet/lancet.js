//----------------------------------------------------------------------------------------------
//LancetJS v.0.05 (alpha 23.11.2016)
//Vladimir Amelkin, 2016
//----------------------------------------------------------------------------------------------
(function(){
    window.temp = 0;
	this.Lancet = {


        addFolder : function(title, folderID)
        {
            var data = { title : title, folderID : folderID }
            //Call of API function for add new View
			$.post('index.php/main/add_folder',
            {
                'data' : data
            }, function(result){
                Lancet.log('Add new folder: '+result);
            })
			.done(function(){

			}).
			fail(function(){
				Lancet.showMessage('error_folder_add');
			});
        },
        initializeEditor: function(data)
        {
            var view = data.view;
            var table = data.table;
            var ID = data.ID || view.parameter || 0;
            var field = data.field;

            var timer;

            if(table && ID && field)
            {
                var row = Lancet.getRow(table, ID);
                var value = row[field];
                console.log(row);

                $(view.container).addClass('ace-editor');

                view.editor = ace.edit('lancet-view-container-'+view.ID);

                view.editor.setPrintMarginColumn(false);
                view.editor.setDisplayIndentGuides(false);
                view.editor.setFontSize('14px');

                view.events.resize = function(){
                    var h = view.getBodyHeight();
                    $(view.container).css( { height: h } );
                    view.editor.resize();
                };

                if(value) {
                    view.editor.setValue(value);
                    view.editor.clearSelection();
                }

                var UndoManager = require('ace/undomanager').UndoManager;
                view.editor.getSession().setUndoManager(new UndoManager());
                view.editor.on('change', function() {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        var updateData = {};
                        updateData['value'] = view.editor.getValue();
                        updateData['ID'] = data['ID'];
                        updateData['table'] = data['table'];
                        updateData['field'] = data['field'];

                        var result = Lancet.updateRow(updateData);
                    }, 1000);
                });
            }
        },
        initializeViewEditor: function(view, field)
        {
            var name = view.parameter;
            var timer;

            if(!name)
            {
                Lancet.Controller.execute('!view '+view.ID+' close');
                Lancet.showMessage('error_loading_'+field);

            } else {
                var editingView = Lancet.getView(name);
                var value = editingView[field];

                $(view.container).addClass('ace-editor');

                view.editor = ace.edit('lancet-view-container-'+view.ID);

                view.editor.setPrintMarginColumn(false);
                view.editor.setDisplayIndentGuides(false);
                view.editor.setFontSize('14px');

                view.events.resize = function(){
                    var h = view.getBodyHeight();
                    $(view.container).css( { height: h } );
                    view.editor.resize();
                };

                if(value) {
                    view.editor.setValue(value);
                    view.editor.clearSelection();
                }

                var UndoManager = require('ace/undomanager').UndoManager;
                view.editor.getSession().setUndoManager(new UndoManager());
                view.editor.on('change', function() {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        var content = view. editor.getValue();
                        var data = {};
                        data['name'] = name;
                        data[field] = content
                        var result = Lancet.updateView(data);
                    }, 1000);
                });
            }
        },

        initializeView: function()
        {
            var view = Lancet.Model.newView;

            view.container = $('<\div>', {
                id: 'lancet-view-container-'+view.ID,
                class: 'lancet-view-container',
            }).appendTo($(view.unitBody));

            view.events.resize = function(){
                var height = view.getBodyHeight();
                console.log(height);
                $(view.container).css(
                {
                    height: height
                });

                console.log('body: '+$(view.unitBody).css('height'));
                console.log('cont: '+$(view.container).css('height'));
            };
            view.events.resize();
            return view;
        },

        cutLongString: function(element, count_lit, light){
            var text = element.html();
            var all_len = text.length;
            var new_text;

            if(all_len > count_lit){
                new_text = text.substr(0, (count_lit - 3)) + '...';
                if(light){
                    var first_part_text = new_text.substr(0, (count_lit - 10));
                    var light_part_text = new_text.substr((count_lit - 10), count_lit);
                    var light_text = "";
                    var array_color = ['#444444', '#545454', '#646464', '#747474', '#848484', '#949494', '#a4a4a4', '#b4b4b4', '#c4c4c4', '#d4d4d4'];
                    for(var i=0;i<10;i++){
                        light_text += '<span style="color: '+array_color[i] + ';">' + light_part_text.substr(i, 1)+'</span>';
                    }
                    new_text = first_part_text + light_text;
                }
                element.html(new_text);
            }
        },
        updateView: function(view)
        {
            //Call of API function for add new View
			$.post('index.php/main/update_view',
            {
                'new_view_data' : view
            }, function(result){
                Lancet.log('Update view status: '+result);
            })
			.done(function(){

			}).
			fail(function(){
				Lancet.showMessage('info_view_update_fail');
			});
        },

        //
        getView: function(name){
			var view = $.ajax( {
                url: 'index.php/main/load_view/'+name,
                type: 'GET',
                async: false
            })
			.done(function(data){
					if(data) {

					} else {
						Lancet.showMessage('error_loading_from_database');
					}
				}).fail(function(){
                    Lancet.showMessage('error_loading_from_database');
                });
            view = $.parseJSON(view.responseText);
            return view;
        },
        getRow: function(table, ID){
			var row = $.ajax( {
                url: 'index.php/main/table_row/'+table+'/'+ID,
                type: 'GET',
                async: false
            })
			.done(function(data){
					if(!data || data == 'null') {
						Lancet.showMessage('error_loading_from_database');
					}
				}).fail(function(){
                    Lancet.showMessage('error_loading_from_database');
                });
            row = $.parseJSON(row.responseText);
            return row;
        },
        updateRow: function(data)
        {
            //Call of API function for add new View
			$.post('index.php/main/update_table_row',
            {
                'data' : data
            }, function(result){
                Lancet.log('Update status: '+result);
            })
			.done(function(){

			}).
			fail(function(){
				//Lancet.showMessage('info_view_update_fail');
			});
        },
        //Dynamic loading of JavaScript file
        loadScript: function(filename) {
            $$i({
                create: 'script',
                attribute: {
                    'type' : 'text/javascript',
                    'src' : filename,
                },
                insert:$$().body,
                onready: function() {
                    console.log('JavaScript has been loaded ('+filename+')');
                }
            });
        },

        getImageFileName: function(imageID) {
            var result = $.ajax({
                url: 'index.php/main/get_image_filename/'+imageID,
                type: 'GET',
                async: false
            }).responseText;
            return result;
        },
        getImageInfo: function(imageID) {
            var result = $.ajax({
                url: 'index.php/main/get_image_info/'+imageID,
                type: 'GET',
                async: false
            }).responseText;
            return result;
        },
        //Create new <img> element with source by imageID and append it to another exist element
        createImage: function(object) {
            var filename = Lancet.getImageFileName(object.imageID);
            console.log(object);
            return $('<img/>',
                {
                    src: '/'+_catalogies.images+'/'+filename,
                    class: object.class,
                    id: object.id,
                    alt: object.alt,
                    css: object.css

                }).appendTo('#'+object.elementID).on('click', function(){console.log('img');});
        },

        changeImage: function(object){
			$('#'+object.id).attr('src', '/'+_catalogies.images+'/'+object.filename);
        },

		loadContent: function(filename, id){
			$.post('index.php/main/load_content/', { 'filename' : filename })
			.done(function(data){
				$('#'+id).html(data);
				//console.log(id);
			})
			.fail(function(){
				this.showMessage('error_loading_content_file');
			});
		},
		//Show alert window with error message
		//The string load from CI: lang/error_messages_lang.php
		//----------------------------------------------------------------------------
		/*showErrorMessage: function(_error_key){
			$.ajax('index.php/main/get_error_message/'+_error_key)
			.done(function(data)
			{
				_controller.execute('!var|'+data+'|alert_message !alert alert_message');
			})
			.fail(function(){
				alert('AJAX: Error calling CI function for loading text string');
			});
		},*/
		//Show alert window with error message
		//The string load from CI: lang/error_messages_lang.php
		//----------------------------------------------------------------------------
		showMessage: function(_key){

			$.ajax('index.php/main/get_message/'+_key)
			.done(function(data)
			{
				_controller.execute('!var|'+data+'|alert_message !alert alert_message');
			})
			.fail(function(){
				alert('AJAX: Error calling CI function for loading text string');
			});
		},
        //Return text of message by key
        //The string load from CI: lang/error_messages_lang.php
        //----------------------------------------------------------------------------
        getMessage: function(_key){

		    var result;
            $.ajax('index.php/main/get_message/'+_key, {
                async: false
            })
                .done(function(data)
                {
                    result = data;
                })
                .fail(function(){
                    alert('AJAX: Error calling CI function for loading text string');
                });
            return result;
        },
        getString: function(_key){
            var result;
            $.ajax('index.php/main/get_string/'+_key, {
                async: false
            })
                .done(function(data)
                {
                    result = data;
                })
                .fail(function(){
                    alert('AJAX: Error calling CI function for loading text string');
                });
            return result;
        },
		//----------------------------------------------------------------------------
		initializeJSON: function(_filename){
			$.getJSON(_filename).done(function(data) {
					_controller.executeArray(data);
					console.log(typeof data);
					_model.initialize();
					_controller.initialize();
				})
				.fail(function() {
					_model.initialize();
					Lancet.showMessage('error_loading_settings_file');
				});
		},

		initialize: function(_filename){
			$.get(_filename)
			.done(function(data) {
				var aData = data.split(/\n/g);
				_controller.executeArray(aData);
				_model.initialize();
				_controller.initialize();
			})
			.fail(function() {
				_model.initialize();
				Lancet.showMessage('error_loading_settings_file');
			});
		},
		Settings: {
			classes: {
				header : 'lancet-header',
				tray : 'lancet-tray',
				toolbar : 'lancet-toolbar',
				desktop : 'lancet-desktop',
				panel : 'lancet-panel',
				pad : 'lancet-pad',
				view : 'lancet-view',
				icon : 'lancet-icon',
				noselect : 'lancet-noselect',
				cursor : 'lancet-cursor',
				image : 'lancet-image',
				overlay : 'lancet-overlay',
				form : 'lancet-form',
				launcher : 'lancet-launcher',
				inputButton : 'lancet-btn',
				inputText : 'lancet-input-text',
				console : 'lancet-console',
                block : 'lancet-block',
                blockList : 'lancet-block-list',
                blockGhost : 'lancet-block-ghots',
                logo : 'lancet-logo'
			},
			dataMode: 'database',
			debugMode: false,					//If 'true' - Lancet.log(message) write to console
			animationSpeed: 250,				//Speed of all animations in app
			cursorSpeed: 1000,
			moveSpeed: 1000,
			newWindowShift: 0,					//Shift in coords of new window (non-use)
			title: 'LancetCMS', 				//Set name of document
			border: 6,							//Size of border (in px)
			mobileMode: false,					//At initialization turn to true if running with a mobile
			borderRadius: 6,					//Rounds the corners of the windows(main <div> of View)
			workspace: undefined,				//
			defaultIcon: 'blueprint.png',		//Set this icon if View doesn`t have its own icons
			LauncherSize: 64,					//Size of Launchers placed on desktop and tray
            blockSize: 64,
			elementMargin: 2,					//The icon indentation from borders of Launcher
			borderDb: 12,						//Crutch
			views: [''],
			catalogies: {
				images: 'images',
				icons: 'icons',
				views: 'views',
				timeline: 'timeline',
				root: 'lancet'
			},
			colors: {
				window: {
					title: {
						active: '#6699ff',
						unactive: '#cccccc',
					},
				}
			}
		},
		Controller: {
			mouse: {
				X: 0, 					//Mouse X
				Y: 0, 					//Mouse Y
				DX: 0, 					//Mouse X in window
				DY: 0, 					//Mouse Y in window
				button: 0,
				setInnerCoords: function(w){
					this.DX = this.X - w.left;
					this.DY = this.Y - w.top;
				}
			},
			timeline: {
				stamps: 0
			},
			console: {
				log: '',
				variables: []
			},
		},

		Model: {
			centerX: 0,				//Центральная координата рабочей области по горизонтали
			centerY: 0,				//Центральная координата рабочей области по вертикали
			screenWidth: 0, 		//Ширина видимой области
			screenHeight: 0,		//Высота видимой области
			focusIndex: 0,			//Указатель на окно, находящееся в фокусе
            focusBlock: 0,
			dragIndex: "", 			//Индекс передвигаемого окна
			resizeIndex: 0,
			clicksCount: 0, 		//Счетчик выбранных окон
			viewsCount: 0,
			tray: 50,
			drag: false, 			//Режим перемещения окна
			resize: false,
			pads: [],
			views: [],
            blocks: [],
            blockLists: [],
			launchers: [],
			panels: [],
			desktop: {
				X: 0,
				Y: 0,
				width: 0,
				height: 40,
				fullscreen: false,
				lock: false					//If false - when move window it don`t cross border of desktop div
			}
		},
		Components: {
			Panel: function (params, coords) {
				if (typeof coords !== 'undefined') {
					this.x = parseInt(coords.x)+_model.centerX;
					this.y = parseInt(coords.y)+_model.centerY;
				} else {
					if(_desktop.lock) {
						this.x = _desktop.centerX;
						this.y = _desktop.centerY;
					} else {
						this.x = _model.centerX;
						this.y = _model.centerY;
					}
				}
				//Text insert in body div and forms sizes of panel
				//If type=image this variable contains url of image
				this.content = params.content;
				//Type of information shown
				this.type = params.type;
				//Numb of created panels
				var count = _model.panels.length;
				//Add link to array of panels in Model
				_model.panels.push(this);
				//Save array index into the object variable
				this.index = count;
				this.create();
				_controller.listenToPanel(this);
			},
			Launcher: function(params, cmd) {
				this.icon = params.icon;
				this.name = name;
				this.command = cmd;

				if(typeof this.icon == 'undefined' || !this.icon)
					this.icon = _settings.defaultIcon;

				this.create();
				_controller.listenToLauncher(this);
				return this;
			},
			Cursor: function(_coords) {
				if(typeof _coords !== 'undefined') {
					this.x = parseInt(_coords.x)+_model.centerX;
					this.y = parseInt(_coords.y)+_model.centerY;
				} else {
					this.x = _model.centerX;
					this.y = _model.centerY;
				}
				this.create();
                console.log(this)
			},
			Pad: function(_text, _class, _parentClass) {
				this.text = _text;
				//If not specified parent element, the Pad is adds to the desktop element
				if(typeof _parentClass !== 'undefined')
					this.parentClass = _parentClass;
				else
					this.parentClass = _class.desktop;
				//If TRUE - Pad is opened
				this.visible = true;
				//Exist a special class like 'lancet-tray', 'lancet-toolbar'
				this.class = _class;
				this.create();
				_controller.listenToPad(this);
				return this;
			},
            Block: function(data) {
                var _block = this;
                _block.height = _block.width = _settings.blockSize;

                _block.content = data.content;
                _block.viewIndex = data.viewIndex;
                _block.parentIndex = data.parentIndex;
                _block.copy = data.copy || false;
                _block.take = false;

                _block.parent = _model.blockLists[_block.parentIndex].unit;

                _block.unit = $('<\div>', {
                    html : _block.content,
                    class : _classes.block
                }).appendTo(_block.parent)

                Lancet.Model.blocks.push(_block);
                _block.index = Lancet.Model.blocks.length-1;
                _controller.listenToBlock(this);
                return _block;
            },
            BlockList : function(data)
            {
                var _list = this;
                _list.parentIndex = data.parentIndex;
                _list.parent = data.parent;
                _list.copy = data.copy || false;
                _list.move = data.move || false;
                _list.drop = data.drop || false;
                _list.unit = $('<\div>',
                {
                    class : 'lancet-block-list',
                    css : data.css
                }).appendTo(_list.parent);

                Lancet.Model.blockLists.push(_list);
                _list.index = Lancet.Model.blockLists.length-1;
                _controller.listenToBlockList(_list);

                return _list;
            }
		},

		View: function(params, coords, value){
			_model.viewsCount++;
			_view = this;
			//Values of all these object set from 'params'

			this.title = {};
			this.properties = { locked: false };
			this.buttons = {};
			this.body = {};
			this.inputs = {};
            this.parameter = value;

            //Declare events of View
            this.events =
            {
                resize: function(){},
                move: function(){},
                close: function(){},
            };

			//Index of new View equals length of array of views in Model
			var count = _model.views.length;
			//Add link of this View to array of views
			_model.views.push(this);

            _model.newView = this;

			//Save array index in variable
			this.index = count;
			this.name = params.name;
			this.ID = _model.viewsCount;
			this.parentIndex = _model.focusIndex;
			//Если параметры заголовка не заданы, устанавливаем по-умолчанию
			if (typeof params.title !== "undefined") {
				this.title.height = params.title.height || "20";
				this.title.paddingHorizontal = params.title.paddingHorizontal || "4";
				this.title.paddingVertical = params.title.paddingVertical || "4";
			}

			this.title.text = params.title;

			//Set all properties from JSON to View object
			if(typeof params.properties !== 'undefined') {
				params.properties = params.properties.split(' ');
				params.properties = $.unique(params.properties);
				if(typeof params.properties !== 'undefined'){
					$.each(params.properties, function(index, value){
						_view.properties[value] = true;
					});
				}
			}

			//Check existing instances of View (PROPERTY: SINGLE)
			if(_view.properties['single'] && typeof _view !== 'undefined'){
				Lancet.log('This is a single View. Check existing instances...');
				var stop = false;							//Define the stop flag variable
				$.each(_model.views, function(index, value){
					if(index > 0 && index !== _view.index && typeof value !== 'undefined' && value.name == _view.name) {
						_view.cleanMemory();				//Clean memory of Model
						stop = true;						//Set stop flag
						Lancet.log('The existing instance has been finded.');
						Lancet.showMessage('info_single_view_opened');
					}
				});
				if(stop)	{
					Lancet.log('The View instance of this View can`t be created.');
					return;							//Stop the function
				}
			}

			//Set sizes and coords for new windows if Desktop Mode switch on
			if(!_settings.mobileMode) {
				this.width = parseInt(params.width) || 320;
				this.height = parseInt(params.height) || 240;
				//Calculate coors of new window
				if(typeof coords !== 'undefined') {
					this.left   = parseInt(coords.x)+_model.centerX  - parseInt(this.width) / 2;
					this.top    = parseInt(coords.y)+_model.centerY  - parseInt(this.height) / 2;
				} else {
					//View (window) centering in the center of parent element (workspace)
					if (_desktop.lock && !this.properties['center']) {
						this.left   = _desktop.centerX - parseInt(this.width) / 2;
						this.top    = _desktop.centerY - parseInt(this.height) / 2;
					}
					//View centering in center of screen
					if(!_desktop.lock || this.properties['center']) {
						this.left   = _model.centerX + count * Lancet.Settings.newWindowShift - parseInt(this.width) / 2;
						this.top    = _model.centerY + count * Lancet.Settings.newWindowShift - parseInt(this.height) / 2;
					}
				}
			}

			//Set body parameters of View
			if(typeof params.body !== 'undefined' && params.body) {

				//If this variable has a string type it`s a JSON-object and need to convert to JS-Object
				if(typeof params.body == 'string')
					params.body = $.parseJSON(params.body);

				this.body.marginLeft = params.body.marginLeft || 0;
				this.body.marginRight = params.body.marginRight || 0;
				this.body.marginTop = params.body.marginTop || 0;
				this.body.marginBottom = params.body.marginBottom || 0;
				this.body.height = this.height - this.title.height - this.title.paddingVertical*2 -  this.body.marginTop - this.body.marginBottom;
				this.body.align = params.body.align;
				this.body.backgroundColor = params.body.backgroundColor;
				this.body.color = params.body.color;
			} else {
				//Body parameters by default
				this.body.align = 'left';
				this.body.marginLeft = 0;
				this.body.marginRight = 0;
				this.body.marginTop = 0;
				this.body.marginBottom = 0;
				this.body.height = this.height - this.title.height - this.title.paddingVertical*2 -  this.body.marginTop - this.body.marginBottom;
			}
			//Load HTML-tags and other content of View
			this.content = params.content;

			this.jscript = params.jscript;

			//Generate array of Buttons from string
			if(typeof params.buttons !== 'undefined') {
				//Separate elements in string
				this.buttons = params.buttons.split(' ');
				//Delete repeats
				this.buttons = $.unique(this.buttons);
			}
			this.properties['minimized'] = false;
			this.overflow = params.overflow || 'hidden';
			//Устанавливаем параметр изменяемости размеров окна

			if(this.properties['resizable']){
				this.minWidth = params.minWidth || params.width || '320';
				this.minHeight = params.minHeight || params.height || '240';
				if(this.minWidth < (this.buttons.length*20+30) ) this.minWidth = (this.buttons.length*20+30);
			}
			if(typeof params.icon !== 'undefined')
				this.icon = params.icon;
			else
				this.icon = Lancet.Settings.defaultIcon;

			if(typeof params.form !== 'undefined')
				this.form = params.form;

			this.inputs = params.inputs;

			this.create();
			_controller.listenToView(this);
			return this;
		},
		openJSON: function(name, value, coords) {
			var _view;

			var filename = _catalogies.views+'/'+name+'.json';
			$.getJSON(filename, function( data ){
				_view = new Lancet.View( data, coords );
			//	return this;
			});
		},

		loadFromDB: function(name, value, coords) {
			var _view;

			$.ajax('index.php/main/load_view/'+name)
			.done(function(data){
					if(data) {
						data = $.parseJSON(data);

						if(typeof data.inputs !== 'undefined' && data.inputs)
							data.inputs = $.parseJSON(data.inputs);

						_view = new Lancet.View(data, coords, value);

					} else {
						Lancet.showMessage('error_loading_from_database');
					}
				}).fail(function(){
                    Lancet.showMessage('error_loading_from_database');
                });
		},

		log: function(str) {
			if(_settings.debugMode) console.log(str);
		},
		str2bool: function(value) {
			if(value === "true")
				return true;
			else
				return false;

		}
	};
	//Functions for View object---------------------------------------------------------------------------------
	_.extend(Lancet.View.prototype, {

        loadContent: function(filename){
            var _view = this;
            $.post('index.php/main/load_content/', { 'filename' : filename })
                .done(function(data){
                    if(data === null || data == '' || !data || typeof data == 'undefined'){
                        Lancet.showMessage('error_loading_content_file');
                    } else {
                        _view.container.html(data);
                    }
                })
                .fail(function(){
                    Lancet.showMessage('error_loading_content_file');
                });
        },

        setTitle: function(value){
            _view.title.text = value;
            $(_view.unitHeadText).text = _view.title.text;
        },
		//Close
		destroy: function(){
			var _view = this;
			this.unit.fadeOut(_settings.animationSpeed, function(){
				if(_view.properties['modal'] && !_settings.mobileMode) _controller.unblockWorkspace();
				_view.unit.remove();						//Delete DOM
				//delete _model.views[_view.index];  			//Delete link to View from array of views in Model
				delete _model.views[_view.index];  			//Delete link to View from array of views in Model
				delete _view;								//Delete this View object
			});
		},
		//This function use when we are opening a single View, but instance of this View already exist
		cleanMemory: function()
		{
				delete _model.views[this.index];  			//Delete link to View from array of views in Model
				delete this;
		},
		minimize: function (animation) {
			var _view = this;
			//Find free cell in tray array
			var trayIndex = $.inArray(0, Lancet.Model.tray);
			//Cancel if there are no free cells
			if(trayIndex == -1) return;
			//Record View index into the free cell of tray array
			Lancet.Model.tray[trayIndex] = _view.index;
			//var height = parseInt(_view.title.height)+_view.title.paddingVertical*2;
			//var width = 160;
			var height = Lancet.Settings.LauncherSize;
			var width = Lancet.Settings.LauncherSize;

			var left = width * trayIndex;
			//Set status flags
			_view.properties['minimized'] = true;
			//_view.maximized = false;

			_view.unit.animate( { top: '0px', left: '0px', width: width+'px', height: height+'px', opacity: '0' }, Lancet.Settings.animationSpeed, function(){
				_view.headTextSize();
				_view.unit.css( { display: 'none' } );
				_view.unitMin.fadeIn(_settings.animationSpeed);
			});
		},
		maximize: function (animation) {
			var _view = this;
			var top, left, width, height;
			if(_view.properties['minimized']){
				var trayIndex = $.inArray(_view.index, Lancet.Model.tray);
				Lancet.Model.tray[trayIndex] = 0;
				_view.unitMin.fadeOut(_settings.animationSpeed);
			}
			//Search to maximized windows
			if(typeof value !== 'undefined'){
				$.each(_model.views, function(index, value){
					if(index > 0 && index !== _view.index && typeof value !== 'undefined' && value.properties['maximized']) {
						//If it exists, minimize it!
						value.minimize();
					}
				});
			}
			//Set status flags
			_view.properties['maximized'] = true;
			_view.properties['minimized'] = false;

			if(animation)
				animation = Lancet.Settings.animationSpeed;
			else
				animation = 0;

			if(!_desktop.lock) {
				_view.unit.css( { position: 'fixed', margin: '0' } );
				top = left = 0;
				width = height = '100%';
			} else {
				_view.unit.css( { position: 'absolute', margin: '0' } );
				top = _settings.border;
				left = _settings.border;
				width = _desktop.width;
				height = _desktop.height;
			}

			_view.unit.animate( { top: top, left: left, width: width, height: height, opacity: '1' },
				animation, function(){
					_view.unit.css( { border: "none", borderRadius: "0", display: 'block' } );
					_view.unitTitle.css( { border: "none", borderRadius: "0" } );
					_view.unitBody.css( { height: "100%" } );
                    //_view.height = Lancet.Model.screenHeight;
                    _view.setBodyHeight();
                    _view.headTextSize();
                    _view.events.resize();
				});

            /*setInterval(function(){
                this.clearInterval();
                _view.events.resize();
                }, animation);
        */
			_view.focus();

		},
		normalize: function (animation) {
			var _view = this;
			var titleBorderRadius = Lancet.Settings.borderRadius+'px '+Lancet.Settings.borderRadius+'px 0 0';
			//Delete index of View from tray array
			if (_view.properties['minimized']){
				var trayIndex = $.inArray(_view.index, Lancet.Model.tray);
				Lancet.Model.tray[trayIndex] = 0;
				_view.unitMin.fadeOut(_settings.animationSpeed);
			}
			//Set status flags
			_view.properties['maximized'] = _view.properties['minimized'] = false;

			_view.unit.css( { position: 'absolute', margin: '4px', border: 'solid 1px', borderRadius: titleBorderRadius+'px', display: 'block' } );
			_view.unitTitle.css( { border: 'solid 1px', borderRadius: titleBorderRadius+'px' } );

			if(_view.top < 0) _view.top = 0;
			if(_view.left < 0) _view.left = 0;

			if(animation) {
				_view.unit.animate( { top: _view.top, left: _view.left, width: _view.width, height: _view.height, opacity: '1' },
					Lancet.Settings.animationSpeed, function(){
						_view.headTextSize();
                        _view.setBodyHeight();
                        _view.events.resize();
					});
            } else {
				_view.unit.css( { top: _view.top, left: _view.left, width: _view.width, height: _view.height } );
                _view.setBodyHeight();
                _view.events.resize();
            }
		},
		//Select window to front
		focus: function(){
			//Link to View in focus
			var viewFocus = _model.views[Lancet.Model.focusIndex];
			//Color of head set unactive if his View(window) has focus
			if(typeof viewFocus !== "undefined")
				$(viewFocus.unitTitle).css({ backgroundColor: _colors.window.title.unactive });
			//Set index of this View to focus index
			Lancet.Model.focusIndex = this.index;
			//Link to new View in focus
			viewFocus = Lancet.Model.views[Lancet.Model.focusIndex];
			//Set active color of head
			viewFocus.unitTitle.css({ backgroundColor: _colors.window.title.active  });
			//Increase click count
			var count = ++Lancet.Model.clicksCount;
			//Set new z-index from click count
			if(this.properties['modal'])
				$(this.unit).css("zIndex", '65535')
			else
				$(this.unit).css("zIndex", count);
		},
		//Begin the drag window
		take: function(){
			//$('body').children().addClass('lancet-noselect');
			_mouse.setInnerCoords(this);
			if(_mouse.DY > this.title.paddingVertical) {
				_model.resize = 0;
				_model.drag = true;
				_model.dragIndex = this.index;
				this.setOpacity(50);
			}
		},
		//Animate moving window in automatic mode
		move: function(coords, mode, speed) {
			if(typeof speed == 'undefined')
				speed = _settings.cursorSpeed;
			var _view = this;
			_view.properties['locked'] = true;
			if(mode) {
				//If true - coords it is a distance
				_view.left = _view.left+coords.x;
				_view.top = _view.top+coords.y;
			} else {
				//If false - coords it is a coords)
				_view.left = coords.x;
				_view.top = coords.y;
			}
			_view.unit.animate( { left: _view.left, top: _view.top }, speed, function(){
				_view.properties['locked'] = false;
			});
		},
		//Drag the window
		drag: function(x, y){
			if(!_settings.mobileMode) {
				this.left = x || (_mouse.X-_mouse.DX);
				this.top = y || (_mouse.Y-_mouse.DY);
				this.left = parseInt(this.left);
				this.top = parseInt(this.top);
			}
			var x2 = this.left+this.width;
			var y2 = this.top+this.height;

			var width, height;
			var border, border2;
			if (_desktop.lock && !this.properties['freedrag']) {
				//Top and Left borders
				border = _settings.border;
				//Bottom and Right borders
				border2 = _settings.border+_settings.borderDb;
				//Get sizes of desktop model
				width = _model.desktop.width;
				height = _model.desktop.height;
			}
			if (!_desktop.lock || this.properties['freedrag']) {
				//There are no borders
				border = 0;
				border2 = _settings.borderDb;
				//Get sizes of document
				width = _model.screenWidth - border2;
				height = _model.screenHeight - border2;
			}
			if(x2 > width) this.left = width - this.width;
			if(y2 > height) this.top = height - this.height;
			if(this.left < border) this.left = border;
			if(this.top < border) this.top = border;
		},
		//Free window from moving
		free: function(){
			_model.drag = false;
			_model.dragIndex = "";
			this.setOpacity(100);
		},
		//Set coords of DOM-element
		position: function(){
			$(this.unit).css( { left: this.left, top: this.top } );
		},
		//Set opacity (before window moving)
		setOpacity: function(opacity){
			$(this.unit).css( { filter: "alpha(opacity = "+opacity+")", opacity: (opacity*0.01) } );
		},
		//Begin resize the window
		startResize: function(){
			if(_view.properties['resizable'] && !_view.properties['maximized'] && !_view.properties['locked']) {
				_model.resizeIndex = this.index;
				_mouse.setInnerCoords(this);
			}
		},
		//The text length in window head is cut if it doesn`t fit to the width
		headTextSize: function(){
			if(typeof this.title.text !== 'undefined'){
				var l = parseInt((this.unit.width() - this.buttons.length*20)/12.5)
				l = parseInt(l+l/1.55);
				if(l <= 2) l = 0;
				var newText = this.title.text.substr(0, l);
				if(l < this.title.text.length) {
					newText = newText.substr(0, newText.length-3)
					newText = newText+"...";
				}
				this.unitHeadText.text(newText);
			}
		},
		//Set height of window
		setHeight: function(_top, _height) {
			this.height = _height;
			this.unit.css( { top: _top, height: this.height+"px" } );
			this.setBodyHeight();
		},
		setBodyHeight: function() {
			//this.body.height = this.height - this.title.height - this.title.paddingVertical*2 -  this.body.marginTop - this.body.marginBottom - 2;
            var height = this.unit.height() - this.title.height - this.title.paddingVertical*2 -  this.body.marginTop - this.body.marginBottom;
			this.unitBody.css( { height: height } );
		},
		getBodyHeight: function() {
            var height = this.unit.height() - this.title.height - this.title.paddingVertical*2 -  this.body.marginTop - this.body.marginBottom - 2;
            return height;
		},
		//Set type of cursor
		setCursor: function(newCursor){
			this.unit.css( { cursor: newCursor } );
			this.unitTitle.css( { cursor: newCursor } );
			$('body').css( { newCursor: newCursor} );
		},
		//Create DOM-element
		create: function(x, y) {
			_view = this;
			_view.unit = $('<div/>', {
				class: _classes.view,
				css: {
					width: _view.width+'px',
					height: _view.height+'px',
					 }
			}).appendTo(_settings.workspace);
			//It shows on desktop when window is minimized
			_view.unitMin = $('<div/>', {
				class: _classes.launcher,
				css: {
					display: 'none',
					margin: _settings.elementMargin,
					width: _settings.LauncherSize+'px',
					height: _settings.LauncherSize+'px',
				}
			}).appendTo('.'+_classes.tray);

			var iconSize = Lancet.Settings.LauncherSize*0.8;
			var iconMargin = (Lancet.Settings.LauncherSize-iconSize)/2;
            var iconFileName = Lancet.getImageFileName(_view.icon);

			_view.unitIcon = $('<div/>', {
				class: _classes.icon,
				css: {
					width: iconSize+'px',
					height: iconSize+'px',
					top: iconMargin+'px',
					left: iconMargin+'px',
					background: 'url("./'+_catalogies.images+'/'+iconFileName+'") center no-repeat',
				}
			}).appendTo(_view.unitMin);

			_view.unitTitle = $('<div/>', {
				class: 'title',
				css: { maxHeight: _view.title.height+"px",
					   paddingTop: _view.title.paddingVertical+"px",
					   paddingBottom: _view.title.paddingVertical+"px",
					   paddingLeft: _view.title.paddingHorizontal+"px",
					   paddingRight: _view.title.paddingHorizontal+"px"
					 }
			}).appendTo(_view.unit);

			_view.unitHeadText = $('<span/>', {
				text: _view.title.text
			}).appendTo(_view.unitTitle);

			$.each(_view.buttons, function(index, value){
				switch(value){

					case 'close':
						_view.closeButton = $('<div/>', {
							class: 'close-button',
							html: '&times'
						}).appendTo(_view.unitTitle);
						break;

					case 'max':
						if(!_settings.mobileMode && !_view.properties['modal']) {
							_view.maxButton = $('<div/>', {
								class: 'max-button',
								html: '&#9913;'
							}).appendTo(_view.unitTitle);
						}
						break;

					case 'min':
						if(!_view.properties['modal']) {
							_view.minButton = $('<div/>', {
								class: 'min-button',
								html: '_'
							}).appendTo(_view.unitTitle);
						}
						break;

				}
			});
			_view.unitBody = $('<div/>', {
				class: _classes.view+'-body',
				html: _view.content,
				css: {
                    height: _view.body.height,
					marginLeft: _view.body.marginLeft,
					marginRight: _view.body.marginRight,
					marginTop: _view.body.marginTop,
					marginBottom: _view.body.marginBottom,
					textAlign: _view.body.align,
					overflow: _view.overflow,
					paddingLeft: '0',
					paddingRight: '0',
					height: '100%',
					border: 'none',
					overflowX: 'hidden',
					overflowY: 'visible',
                }
			}).appendTo(_view.unit);

			//Set colors, if its exists in file of View
			if(typeof _view.body.backgroundColor !== 'undefined'){
				_view.unit.css( {
                    backgroundColor: _view.body.backgroundColor
                } );
				_view.unitBody.css( {
                    backgroundColor: _view.body.backgroundColor
                } );
			}
			if(typeof _view.body.color !== 'undefined')
				_view.unitBody.css( {
                    color: _view.body.color
                } );
			/*
			if(typeof _view.form != 'undefined' || _view.form) {
				_view.unitForm = $('<form/>', {
					action: _view.form.action,
					method: _view.form.method,
					name: _classes.form+'-'+_view.ID
				}).appendTo(_view.unitBody);
			} else {
				_view.unitForm = $('<div/>', { css: { textAlign: 'center' } } ).appendTo(_view.unitBody);
			}
			*/
			_.each(_view.inputs, function(input){
				var $newInput;

				console.log(input);

				switch(input.type)
				{
					case 'file':
						$newInput = $('<input/>', {
							class: _classes.inputText,
							type: 'file',
							placeholder: input.placeholder,
							name: input.name,
							value: input.value
						});
						break;
					case 'text':
						$newInput = $('<input/>', {
							class: _classes.inputText,
							type: 'text',
							placeholder: input.placeholder,
							name: input.name,
							value: input.value
						});
						break;
					case 'password':
						$newInput = $('<input/>', {
							class: _classes.inputText,
							type: 'password',
							placeholder: input.placeholder,
							name: input.name,
							value: input.value
						});
						break;
					case 'submit':
						$newInput = $('<input/>', {
							class: _classes.inputButton,
							type: 'submit',
							name: input.name,
							value: input.value
						}).on('click', function(){
							_view.form.submit();
						});
						break;
					case 'button':
						$newInput = $('<button/>', {
							class: _classes.inputButton,
							id: _view.ID
						}).on('click', function(){
							//if(input['return'] == 'close') _view.destroy();
							_controller.execute(input.return, _view);
						}).text(input.value);
						break;
					case 'console':
						$newInput = $('<textarea/>', {
							class: _classes.console,
						}).on('keyup', function(e){
							//if(input['return'] == 'close') _view.destroy();

							//If have been pressed 'Enter' - check command line
							if(e.keyCode == '13')
								_console.getCommand();
						});
						//_console.write('!refresh');

						break;
				}
				$newInput.appendTo(_view.unitBody);


			});

			//-------------------------------------------------------------------------
			$jsScript = $('<script/>', {
						type: 'text/javascript',
						html: '$(function(){ ' + this.jscript + ' });'
					});

			$jsScript.appendTo(_view.unitBody);
			//-------------------------------------------------------------------------



			if(Lancet.Settings.mobileMode) {
				//If switch on Mobile mode - new window will be maximized
				_view.maximize(false); //false - maximize without animation
			} else {
				if(_view.properties['maximized'])
					//If propertie of View 'maximized' set in true, new window will be maximized
					_view.maximize(false);
				else
					_view.normalize(false);
			}
			$(_view.unit).fadeIn(Lancet.animationSpeed);
			_view.headTextSize();
			if(_view.properties['modal'] && !_settings.mobileMode) _controller.blockWorkspace();
			_view.focus();
		}
	});

	_.extend(Lancet.Components.Pad.prototype, {
		create: function(){
			this.unit = $('<div/>', {
				class: _classes.pad,
			} ).appendTo('.'+this.parentClass);
			this.title = $('<div/>', {
				class: _classes.pad+'-title',
			} ).appendTo(this.unit).text(this.text);
			this.body = $('<div/>', { class: this.class } ).appendTo(this.unit);
		}
	});

	//Function for Launcher object---------------------------------------------------------------------------------
	_.extend(Lancet.Components.Launcher.prototype, {
		create: function () {
			var _launcher = this;
			_launcher.unit = $('<div/>', {
				class: _classes.launcher,
				css: {
					width: _settings.LauncherSize+'px',
					height: _settings.LauncherSize+'px',
					margin: _settings.elementMargin,
				}
			}).appendTo('.'+_classes.toolbar);

			var iconSize = _settings.LauncherSize*0.8;
			var iconMargin = (_settings.LauncherSize-iconSize)/2;

            var iconFileName = Lancet.getImageFileName(_launcher.icon);

			_launcher.unitIcon = $('<div/>', {
				css: {
					position: 'relative',
					width: iconSize+'px',
					height: iconSize+'px',
					top: iconMargin+'px',
					left: iconMargin+'px',
					background: 'url("./'+_catalogies.images+'/'+iconFileName+'") center no-repeat',
				}
			}).appendTo(_launcher.unit);
		}
	});
	//Function for Model object---------------------------------------------------------------------------------
	_.extend(Lancet.Model, {
		getScreenSize: function () {
			var doc = document;
			var win = doc.parentWindow || doc.defaultView;
			var scroll = [
				win.pageXOffset || doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
				win.pageYOffset || doc.documentElement.scrollTop  || doc.body.scrollTop  || 0
			];
			this.screenWidth = doc.body.clientWidth;
			this.screenHeight = doc.body.clientHeight;
			this.centerX = doc.body.clientWidth/2+scroll[0];
			this.centerY = doc.body.clientHeight/2+scroll[1];

            console.log('centerY : '+this.centerY);
            console.log('c_height: '+doc.body.clientHeight);
            console.log('scroll: '+scroll[1]);

            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || Lancet.Model.screenWidth <= 320)
                _settings.mobileMode = true;
            else
                _settings.mobileMode = false;

			//Set sizes from model to div element
			_desktop.position();
		},
		initialize: function () {

            _model.blocks[0] = null;
			this.getScreenSize();
			//Fill 0 index
			this.views.push(0);
			this.createTray();
			var toolbarHeight = _settings.LauncherSize+_settings.elementMargin*2;

			//Create the elements of interface in the document
			switch(_settings.dataMode){
				case 'file':
				//Load data for Launchers from JSON-file-------------------------------------------------------------------------
				$.each(_settings.views, function(index, value){
					$.getJSON(_catalogies.views+'/'+value+'.json', function(data){
						if(data.launch){
							//Create new Launcher object and send to it some properties from json-object of View and filename to execute
							new Lancet.Components.Launcher(data, '!run '+value);
						}
					});
				});
				break;

				//Load data for Launchers from table 'views' of database
				case 'database':
					$.ajax('index.php/main/get_launcher_list')
					.done(function(data)
					{
						var launcherList = $.parseJSON(data);
						$.each(launcherList, function(i, item)
						{
							$.ajax('index.php/main/get_launcher_data/'+item.name)
							.done(function(data){
								var launcherData = $.parseJSON(data);
								new Lancet.Components.Launcher(launcherData, '!run '+item.name);
							});
						});
					});
				break;
			}




			if(_settings.mobileMode) {
				_desktop.fullscreen = true;
				_desktop.lock = false;
				//$('body').children().hide();
				//$('.'+_classes.desktop).appendTo('body');
				//$('.'+_classes.pad).appendTo('.'+_classes.desktop);
			}

			if (_desktop.lock)
				_settings.workspace = '.'+_classes.desktop;
			else
				_settings.workspace = 'body';

			$('title').text(_settings.title);

			_desktop.position();

			//Debug info
			var debugText = '';
			debugText += navigator.userAgent+"\n";
			debugText += "Screen--------------- \n Width: "+this.screenWidth+"\n Height: "+this.screenHeight+"\n Horizontal center: "+this.centerX+"\n Vertical center: "+this.centerY+"\n";
			debugText += "Desktop-------------- \n Width: "+this.desktop.width+"\n Height: "+this.desktop.height+"\n X: "+this.desktop.X+"\n Y: "+this.desktop.Y+"\n";
			debugText += "Mobile Mode: "+Lancet.Settings.mobileMode+"\n";
			debugText += "Workspace: "+_settings.workspace+"\n";
			debugText += "Fullscreen: "+_desktop.fullscreen+"\n";
			Lancet.log(debugText);

			$.ajax('index.php/account/check_logged_in').
                done(function(result) {
                    if(result === '1') {
                        Lancet.log('Logged_in: true');
                        $.ajax('index.php/account/current_account').
                            done(function(result){
                                Lancet.Account = $.parseJSON(result);
                                Lancet.Controller.execute('!var|<br>Hello, '+Lancet.Account.login+'!<br><br>|hello !alert hello')
                        });
                    } else {
                        Lancet.log('Logged_in: false');
                    }
            });
		},
		createTray: function () {
			var l = this.tray;
			this.tray = new Array();
			for(var i = 0; i < l; i++ )
				this.tray.push(0);
		}
	});
	_.extend(Lancet.Model.desktop, {
		position: function() {
			if(_desktop.fullscreen) {
				$('body').css( { margin: 0 } );
				this.X = 0;
				this.Y = 0;
				this.width = _model.screenWidth;/*-_settings.border-_settings.borderDb;*/
				this.height = _model.screenHeight;/*-_settings.border-_settings.borderDb;*/
			} else {
				$('body').css( { margin: _settings.border } );
				this.X = 0;
				this.Y = 0;
				this.width = $('.'+_classes.desktop).parent().width();
				this.height = $('.'+_classes.desktop).parent().height();
			}
			//Central coords of desktop
			this.centerX = this.width/2;
			this.centerY = this.height/2;
			//Set coords and sizes of div-element from Model
			$('.'+_classes.desktop).css( { width: this.width, height: this.height, top: this.X, left: this.Y } );
		},

		set: function (_object) {
			if(typeof _object.class !== 'undefined')
				_classes.desktop = _object.class;
			if(typeof _object.fullscreen !== 'undefined')
				_desktop.fullscreen = _object.fullscreen;
			if(typeof _object.lock !== 'undefined')
				_desktop.lock = _object.lock;
		}
	});
    	//Functions for Blocks---------------------------------------------------------------------------------
	_.extend(Lancet.Components.Block.prototype, {
            moveGhost: function()
            {
                this.X = _mouse.X;
                this.Y = _mouse.Y;
            },
            positionGhost: function()
            {
                //this.ghost.css( { top : this.Y-this.height/2, left : this.X-this.width/2 } );
                this.ghost.css( { top : this.Y+4, left : this.X+4 } );
            },
            createGhost : function()
            {
                this.ghost = $('<\div>', {
                    class : _classes.block,
                    html : this.content
                })
                .appendTo('body')
                .css( { position : 'absolute', zIndex : '65535' } );
            },
            copy : function()
            {
                _block = this;
                var _new = new Lancet.Components.Block();
                _new = _block;

            }
    });
	_.extend(Lancet.Components.BlockList.prototype, {
            clear : function()
            {
                _.each(_model.blocks, function(object, index){
                    delete _model.blocks[index];
                });
                this.unit.empty();

            }
    });
	//Functions for Controller---------------------------------------------------------------------------------
	_.extend(Lancet.Controller, {
		initialize: function()
		{

			$(document).mousemove(function(eventObject){
                //Get mouse coords
				_mouse.X = eventObject.pageX;
				_mouse.Y = eventObject.pageY;

                //Move ghost of movable blocks
                if(_model.focusBlock > 0)
                {
                    _block = _model.blocks[_model.focusBlock];
                    _block.moveGhost();
                    _block.positionGhost();
                }

				//Window moving----------------------------------------
				if(_model.drag) {
					var index = _model.dragIndex;
					if(_mouse.button === 1) {
						_model.views[index].drag();
						_model.views[index].position();
					} else {
							 _model.views[index].free();
					}
				}
				if(_mouse.button != 1)
					$('body').css( { cursor: "default" } );

				//View resizing----------------------------------------
				if(_model.resize > 0 && !_model.drag && _model.resizeIndex) {
					var _view = _model.views[Lancet.Model.resizeIndex];
					if(_mouse.button == 1) {
						var border = _settings.border;
						var border2 = _settings.border+_settings.borderDb;
						switch (_model.resize) {
							case 1:
								//Top
								var newTop = _mouse.Y;
								var newHeight = (_view.top - newTop) + _view.height;
								if(newHeight > _view.minHeight && newTop > border) {
									_view.top = newTop;
									_view.setHeight(newTop, newHeight);
								}
								break;
							case 3:
								//Right
								var newWidth = _mouse.X - _view.left;
								if(newWidth > _view.minWidth && _mouse.X < _model.screenWidth - border2) {
									_view.width = newWidth;
									_view.unit.css( {width: _view.width + "px"} );
									_view.headTextSize();
								}
								break;
							case 4:
								break;
							case 5:
								//Bottom
								var newHeight = _mouse.Y - _view.top;
								if(newHeight > _view.minHeight && _mouse.Y < _model.screenHeight - border2) _view.setHeight(_view.top, newHeight);
								break;
							case 7:
								//Left
								var newLeft = _mouse.X;
								var newWidth = (_view.left - newLeft) + _view.width;
								if(newWidth > _view.minWidth && newLeft > border) {
									_view.left = newLeft;
									_view.width = newWidth;
									_view.unit.css( { left: _view.left + "px", width: _view.width + "px" });
									_view.headTextSize();
								}
								break;
						}
                        //Call of event function
                        _view.events.resize();
					}
				}
			}).on('mouseup', function(e){
                //View processing
				delete Lancet.Model.resizeIndex;
				Lancet.Model.resize = 0;
				_mouse.button = 0;

                //If now is block moving and block list under mouse isn't parent of this moving block
                if(_model.focusBlock > 0)
                {
                    var _block = _model.blocks[_model.focusBlock];
                    _block.ghost.remove();
                    if(_block.take == true)
                    {
                        _block.take = false;
                        if(_model.blockLists[_block.parentIndex].copy == true)
                        {
                            new Lancet.Components.Block(
                            {
                                content : _block.content+' copy',
                                viewIndex : _model.focusIndex,
                                parentIndex :  _block.parentIndex,
                                copy : false
                            });
                            //Return reference value
                             _block.parentIndex = _block.historyIndex;

                        } else {
                            _block.unit.appendTo(_block.parent);
                        }
                        _model.focusBlock = 0;
                    } else {

                    }
                }

				return this;
			}).on('mousedown', function(e){
				_mouse.button = 1;
				return this;
			});

			$(window).resize(function(){
				_model.getScreenSize();
			});
		},
		listenToView: function(_view) {
			$(_view.unit).on('mousedown', function(){
				_view.focus();
				_view.startResize();
			}).on('mousemove', function(eventObject){
				if(_mouse.button!= 1 && _view.properties['resizable'] && !_view.properties['maximized'] && !_view.properties['minimized'] && !_view.properties['locked']) {
					var borderTop = parseInt(_view.body.marginTop);
					var borderBottom = parseInt(_view.body.marginBottom);
					var borderLeft = parseInt(_view.body.marginLeft);
					var borderRight = parseInt(_view.body.marginRight);

					_mouse.setInnerCoords(_view);

					$(this).css( { cursor: "default" } );
					$(_view.unitTitle).css( {cursor: "default" } );
					_model.resize = 0;
					//Set resize mode for top border (1)
					if(_mouse.DY < borderTop) {
						_model.resize = 1;
						_view.setCursor("n-resize");
					}
					//Set resize mode for right border (3)
					if(_mouse.DX > _view.width-borderRight) {
						_model.resize = 3;
						_view.setCursor("e-resize");
					}
					//Set resize mode for bottom border (5)
					if(_mouse.DY > _view.height-borderBottom) {
						_model.resize = 5;
						_view.setCursor("s-resize");
					}
					//Set resize mode for left border (7)
					if(_mouse.DX < borderLeft) {
						_model.resize = 7;
						_view.setCursor("w-resize");
					}
				}
			}).on('mouseup', function(){
			});

			$(_view.unitForm).on('click', function(){

			});

			//Head-------------------------------------------------------
			$(_view.unitTitle).on('mousedown', function(){
				if(!_view.properties['fixed'] && !_view.properties['locked'] && !_view.properties['maximized'] && !_view.properties['minimized'] && _model.focusIndex == _view.index)
					_view.take();
				if(!_view.properties['minimized']) _view.focus();
			}).on('mousemove', function(){

			});

			//Close button-----------------------------------------------
			$(_view.closeButton).on('mousedown', function(){
				if(!_view.properties['locked']) _view.destroy('cancel');
				return false;
			});

			//Maximize button--------------------------------------------
			$(_view.maxButton).on('mousedown', function(){
				if(!_view.properties['locked']) {
					if(_view.properties['maximized'])
						_view.normalize(true);
					else
						_view.maximize(true);
				}
			});

			//Minimize button--------------------------------------------
			$(_view.minButton).on('mousedown', function(){
				if(!_view.properties['locked']){
					if(_view.properties['minimized'])
						_view.normalize(true);
					else
						_view.minimize();
				}
			});

			$(_view.unitMin)
				.on('dblclick', function(){
					if(_view.properties['maximized'])
						_view.maximize(true);
					else
						_view.normalize(true);
				})
				.on('click', function(){
					if(Lancet.Settings.mobileMode) _view.maximize();
				});
		},
		listenClear: function(_element) {
			$(_view).off().children().off();
		},
		listenToLauncher: function(_launcher) {
			$(_launcher.unit)
				.on('dblclick', function(){
					if(!_settings.mobileMode) _controller.execute(_launcher.command);
				})
				.on('click', function(){
					if(_settings.mobileMode) _controller.execute(_launcher.command);
				});
		},
		listenToPad: function(_pad) {
			_pad.title.on('click', function(){
				if(_pad.visible) {
					_pad.body.slideUp(_settings.animationSpeed);
					_pad.visible = false;
				} else {
					_pad.body.slideDown(_settings.animationSpeed);
					_pad.visible = true;
				}
			});
		},
		listenToBlock: function(_block) {
			_block.unit.on('mousedown', function(){
                console.log(_model.blockLists[_block.parentIndex].move);
                if(_model.blockLists[_block.parentIndex].move == true)
                {
                    _block.take = true;
                    _model.focusBlock = _block.index;
                    _block.createGhost();
                    _block.moveGhost();
                    _block.positionGhost();
                }
                return false;
            });
		},
        listenToBlockList : function(_list)
        {
            _list.unit.on('mouseup', function(){
                //focusBlock > 0 - that's mean block moving process
                if(_model.focusBlock > 0)
                {
                    _block = _model.blocks[_model.focusBlock];
                    console.log(_block.parentIndex+' : '+_list.index);
                    if(_block.parentIndex != _list.index && _list.drop == true)
                    {
                        _block.historyIndex = _block.parentIndex;
                        _block.parentIndex = _list.index;
                    } else {
                        _block.take = false;
                    }
                }
            });

        },
		listenToPanel: function(_panel) {
			_panel.unit.on('click', function(){
				_panel.destroy();
			});
		},
		blockWorkspace: function() {
			var overlay = $("<div/>", { class: _classes.overlay, css: { opacity: '0', zIndex: '65534' } }).appendTo(_settings.workspace);
			overlay.animate( { opacity: '0.75' }, _settings.animationSpeed);
		},
		unblockWorkspace: function() {
			$('.'+_classes.overlay).animate( { opacity: '0' }, _settings.animationSpeed, function(){
				this.remove();
			});
		},
		executeJSON: function(_filename) {
			$.getJSON(_filename, function(data){
				_controller.executeArray(data);
			})
				.fail( function() {
					_controller.execute('var|Cannot load settings from JSON file.|json_alert alert json_alert');
				});
		},
		executeArray: function(_commands){
			$.each(_commands, function(index, value) {
				_controller.execute(value);
			});
		},
		execute: function(str, _view) {
            var r;
			//This function need to refactoring
			_console.write(str); 					//Echo to the log
			Lancet.log(str.toString()); 			//Write into the browser debug-console
			var stringValue = str.split('|');		//This var takes array like ('var', 'value of Variable', 'name of Variable and other part of command string')
			var text;								//This takes value of Variable
			if(stringValue.length > 1){				//If the string has value extracted it
				str = stringValue[0];				// Take first command. It must be 'var'
				text = stringValue[1];				//Value of this Variable
				//if(typeof stringValue[2] !== 'undefined')
				str+=' '+stringValue[2];			//The other part of this command string
				str = str.split(' ');				//Create array for futher processoing
			} else {
				str = str.split(' ');				//If string hasn`t variable definition just create array of the elements of command string
			}
			str[str.length-1] = str[str.length-1].replace(/\r|\n/g, ''); //Remove '/n' from last element of string
			var command;
			$.each(str, function(i, value) {
				switch(value){
					case '!header':
						if(str[i+2] !== 'body') str[i+2] = '.'+str[i+2];
						$('<div/>', { class: _classes.header, } ).prependTo(str[i+2]).text(_settings.title);
						break;
                    case '!title':
						_settings.title = _console.variables[str[i+1]];
                        console.log(_console.variables[str[i+1]]);
                        $('html head').find('title').text(_console.variables[str[i+1]]);
                        break;
                    case '!logo':
                        console.log('/'+_catalogies.images+'/'+str[i+1]);
                        if(str[i+4] !== 'body') str[i+4] = '.'+str[i+4];
                        $('<img/>', { id: _classes.logo, src: '/'+_catalogies.images+'/'+str[i+1], css: { margin: '* auto', width: str[i+2], height: str[i+3] }} ).prependTo(str[i+4]);
                        break;
					case '!pad':
						new Lancet.Components.Pad(_console.variables[str[i+1]], str[i+2], str[i+3]);
						break;
					case '!desktop':
						switch(str[i+1]){
							case 'fullscreen': _desktop.fullscreen = true; break;
							case 'lock': _desktop.lock = true; break;
							case 'background':
								$('.'+_classes.desktop).css( { backgroundImage: 'url(./'+_catalogies.images+'/'+str[i+2]+') ' } );
								console.log('./'+_catalogies.images+'/'+str[i+2]);
							break;
						}
						break;
					case '!vars':
						for(varName in _console.variables)
							_console.write(varName+': '+_console.variables[varName]);
						break;
					case '!launcher':
						new Lancet.Components.Launcher( { } , _console.variables[str[i+1]]);
						break;
					case '!cls':
						_console.clear();
						break;
					case '!refresh':
						_console.refresh();
						break;
					case '!var':
						_console.variables[str[i+1]] = text;
						break;
					case '!value':
						_console.write(str[i+1]+': '+_console.variables[str[i+1]]);
						break;
					case '!close':
						command = str[i];
						switch(str[i+1]){
							case 'this':
								_view.destroy();
							break;
							case 'parent':
								if(typeof _model.views[_view.parentIndex] !== 'undefined')
								_model.views[_view.parentIndex].destroy();
								_view.destroy();
							break;
						}
						break;
					case '!run':
						command = str[i];
						var param1 = str[i+1];  //View name
                        var param2 = str[i+2];  //Parameter
						var param3 = str[i+3];  //X
						var param4 = str[i+4];  //Y
						var coords;
						if(typeof param3 !== 'undefined') {
							coords = {};
							coords.x = parseInt(param3);
						}
						if(typeof param4 !== 'undefined') coords.y = parseInt(param4);


						//if(typeof _view !== 'undefined') _view.destroy();

						if(typeof param1 !== 'undefined') {

							if(_settings.dataMode == 'file')
								Lancet.openJSON(params1, param2, coords);

							if(_settings.dataMode == 'database')
								Lancet.loadFromDB(param1, param2, coords);

						}
                        console.log(str);

						//str.splice(i, 2);
						break;

					case '!alert':
						command = str[i];
						if(typeof _view !== 'undefined') _view.destroy();
						new Lancet.View( {
							modal: true,
							buttons: 'close',
							title: _settings.title,
							content: _console.variables[str[i+1]],
							body: {
								align: 'center',
								marginTop: 8,
								marginBottom: 8,
								marginLeft : 6,
								marginRight: 6
							},
							inputs: [
								{
                                    type : 'button',
                                    value : 'Ok',
                                    return : '!view this close'
                                }
							],
							width: 220,
							height: 140,
							properties: 'center modal fixed'
						});
						str.splice(i, 2);
						break;

					case '!confirm':
						command = str[i];
						//console.log(str);
						var string;
						var param1 = str[i+2];
						var param2 = str[i+3];
						if(typeof param2 !== 'undefined')
							string = param1+' '+param2;
						else
							string = param1;

						new Lancet.View( {
							modal: true,
							buttons: 'close',
							title: _settings.title,
							content: _console.variables[str[i+1]],
							body: {
								align: 'center',
								marginTop: 8,
								marginBottom: 8,
								marginLeft : 6,
								marginRight: 6
							},
							inputs: [
								{ type : 'button', value : 'Ok', return : '!view this close '+string },
								{ type : 'button', value : 'Cancel', return : '!view close this' }
							],
							width: 220,
							height: 150,
							properties: 'modal center fixed'
						});
						str.splice(i, 4);
						break;
					case '!play':
						//if(_timeline.timer) clearInterval(_timeline.timer);
						_controller.timeline.load(str[i+1]);
						str.splice(i, 2);
						break;
                    case '!stop':
                        _controller.timeline.stop();
                        str.splice(i, 1);
                        break;
					//Сommand control of Views
					case '!view':
						//Variable for link to View
						var currentView;

						if(typeof str[i+1] !== 'undefined' || str[i+1] == '0') {
							if(str[i+1] == 'this')
								currentView = _model.views[_model.focusIndex];
							else
								currentView = _model.views[str[i+1]];

							if(typeof currentView !== 'undefined') {

								command = str[i+2];
								var coords;
								if(typeof str[i+3] !== 'undefined') {
									coords = {};
									coords.x = parseInt(str[i + 3]);
									if (typeof str[i + 4] !== 'undefined') coords.y = parseInt(str[i + 4]);
								}
								switch(command){
									case 'move': currentView.move(coords, true); break;
									case 'moveto': currentView.move(coords, false); break;
									case 'maximize':
										if(!currentView.properties['maximized'])
											currentView.maximize(true);
										else
											_console.write('Has been maximized');
										break;
									case 'minimize':
										if(!currentView.properties['minimized'])
										currentView.minimize(true);
										else
											_console.write('Has been minimized');
										break;
									case 'close': currentView.destroy(); break;
									case 'normalize':
										if(currentView.properties['minimized'] || currentView.properties['maximized'])
											currentView.normalize(true);
										else
											_console.write('Has been normalized');
										break;
								}
							} else {
								_console.write('View with index '+str[i+1]+' is not exists.');
							}
						} else {
							_console.write('View with index '+str[i+1]+' is not exists.');
						}
						//str.splice(i, 3);
					break;
				case '!cursor':
					var _cursor = _model.cursor;
					command = str[i+1];
					var coords;
					if(typeof str[i+2] !== 'undefined') {
						coords = {};
						coords.x = parseInt(str[i + 2]);
						if (typeof str[i + 3] !== 'undefined') coords.y = parseInt(str[i + 3]);
					}
					if(command == 'show') {
                        $('.'+_classes.cursor).remove();
                        _model.cursor = new Lancet.Components.Cursor(coords);
                    }
                    if(command == 'hide') {
                        if(typeof _model.cursor !== 'undefined') {
                            _model.cursor.unit.remove();
                            delete _model.cursor;
                        }
                    }
					if(command == 'move') _model.cursor.move(coords, true);
					if(command == 'moveto') _model.cursor.move(coords, false);
					str.splice(i, 2);
					break;
				case '!text-pos':
					new Lancet.Components.Panel( { type: 'text', content: _console.variables[str[i+1]] }, { x: str[i+2], y: str[i+3] });
					str.splice(i, 4);
					break;
				case '!text':
					new Lancet.Components.Panel( { type: 'text', content: _console.variables[str[i+1]] });
					str.splice(i, 2);
					break;
				case '!image-pos':
					new Lancet.Components.Panel( { type: 'image', content: '/'+_catalogies.images+'/'+_console.variables[str[i+1]] }, { x: str[i+2], y: str[i+3] });
					str.splice(i, 4);
					break;
				case '!image':
					new Lancet.Components.Panel( { type: 'image', content: '/'+_catalogies.images+'/'+_console.variables[str[i+1]] });
					str.splice(i, 2);
					break;
				case '!clear':
					$.each(_model.panels, function(i, _panel) {
						if(typeof _panel !== 'undefined')
						_panel.destroy();
					});
					str.splice(i, 1);
					console.log(str);
				break;
				case '!debugmode':
					if(str[i+1] == "on")
						_settings.debugMode = true;
					else
						_settings.debugMode = false;
				break;
				case '!set_catalog':
					_catalogies[str[i+1]] = str[i+2];
				break;
				case '!set_class':
					_classes[str[i+1]] = str[i+2];
				break;
				case '!set_views':
					var viewsArray = str[i+1].split(',');
					_settings.views = viewsArray;
					Lancet.log(_settings.views);
				break;
				case '!set_title':
					_settings.title = str[i+1];
				break;
				}
			});
            return r;
		}
	});
	_.extend(Lancet.Controller.timeline, {
		initialize: function(data)
        {
            _timeline.unit = $('<\div>',
            {
                class : 'lancet-timeline-controller'
            }).appendTo(_settings.workspace);

            $('<\div>',
            {
                class : 'lancet-timeline-button play'
            }).appendTo(_timeline.unit).on('click', function(){
                _timeline.play();
            });

            $('<\div>',
            {
                class : 'lancet-timeline-button pause'
            }).appendTo(_timeline.unit).on('click', function(){
                _timeline.pause();
            });

            $('<\div>',
            {
                class : 'lancet-timeline-button stop'
            }).appendTo(_timeline.unit).on('click', function(){
                _timeline.stop();
            });
            _controller.execute('!clear');
            $('.'+_classes.cursor).remove();
			Lancet.log('Start animation');
			//Get data to the object variable
			this.stamps = data.stamps;
			_console.variables = data.variables;
			//Clear counts
			this.position = 0;
			this.sec = 0;
			//Set timer
			Lancet.log('Timeline is started');
            this.play();
		},
        play : function()
        {
            if(!this.timer) {
                console.log('TIMER: '+this.timer);
                this.timer = setInterval(function(){
                    var string = "Frame "+_timeline.sec;
                    //Split string and create two-digit array
                    _timeline.string = _timeline.stamps[_timeline.position].split(':/');
                    //First element (0) - timestamp (in sec)
                    //Second element (1) - command line
                    //Check for a match timestamp and current second
                    if(_timeline.string[0] == _timeline.sec)
                    {
                        //If timestamp is equal to the current second
                        //Execute command line of this timestamp
                        _controller.execute(_timeline.string[1], _view);
                        string = string + ": "+_timeline.string[1];
                        //Step to the next position
                        _timeline.position++;
                    }
                    Lancet.log(string);
                    //If next timestamp is not exist timer of Timeline is switch off
                    if(typeof _timeline.stamps[_timeline.position] == 'undefined')
                        clearInterval(_timeline.timer);
                    //Increase second count
                    _timeline.sec++;
                }, 1000);
            }
        },
		pause: function()
        {
            clearInterval(this.timer);
            this.timer = 0;
		},
		stop: function()
        {
            this.pause();
            this.clear();
            if(_timeline.unit)
                _timeline.unit.remove();
            Lancet.Controller.execute('!clear');
            Lancet.Controller.execute('!cursor hide');
		},
        clear : function()
        {
			this.stamps = 0;
			this.position = 0;
			this.sec = 0;
        },
		load: function(name)
        {
			var filename = './'+_catalogies.timeline+'/'+name+'.json';

            if(_settings.dataMode == 'file')
            {
                $.getJSON(filename, function(data){
                    _timeline.initialize(data);
                });
            }

			if(_settings.dataMode == 'database')
            {
                $.get('index.php/main/timeline/'+name)
                .done(function(data){
                    if(data != 'null')
                    {
                        data = $.parseJSON(data);

                        var content = $.parseJSON(data.content);
                        _timeline.initialize(content);
                    } else {
                        Lancet.showMessage('error_timeline_not_found');
                    }
                })
                .fail(function(data){
                    Lancet.showMessage('error_loading_timeline');
                })
                .then(function(data){
                });
            }



		}
	});
	_.extend(Lancet.Controller.console, {
		getCommand: function()
		{
			var text = $('.'+_classes.console).val();
			if(typeof text != 'undefined')
			{
				//Send all text lines from console into the array
				var lines = text.split(/\r?\n/);
				//Execute the last string - it is a user entered the command
				_controller.execute(lines[lines.length-2]);
				console.log(lines[lines.length-2]);
			}
		},
		write: function(string)
		{
			this.log+=string+'\n';
			this.refresh();
		},
		refresh: function(string)
		{
			$('.'+_classes.console).html(this.log).scrollTop(10000);
		},
		clear: function(){
			this.log='';
			this.refresh();
		}
	});
	_.extend(Lancet.Components.Cursor.prototype, {
		create: function(){
			this.unit = $('<div/>', {
				class: _classes.cursor,
				css: {
					left: this.x,
					top: this.y
				}}).appendTo('body');
		},
		move: function(coords, mode){
            coords.x = parseInt(coords.x);
            coords.y = parseInt(coords.y);
			if(mode) {
                //Move...
				this.x = this.x + coords.x;
				this.y = this.y + coords.y;
			} else {
                //Move to...
				this.x = coords.x + _model.centerX;
				this.y = coords.y + _model.centerY;
			}
			this.unit.animate( { left: this.x, top: this.y }, _settings.cursorSpeed );
		}
	});
	_.extend(Lancet.Components.Panel.prototype, {
		create: function() {
			var count = ++Lancet.Model.clicksCount;
			var _panel = this;
			switch(_panel.type){
				case 'text':
                    console.log(parseInt($('.lancet-desktop').css('width')));
					_panel.unit = $('<div/>', {
						class: _classes.panel,
					}).appendTo(_settings.workspace);
					_panel.unitBody = $('<div/>', {
						class: _classes.panel+'-body'
					}).html(_panel.content).appendTo(_panel.unit);
					_panel.width = parseInt(_panel.unit.css('width'));
					_panel.height = parseInt(_panel.unit.css('height'));
					break;
				case 'image':
					_panel.unit = $('<div/>', {
						class: _classes.image,
					}).appendTo(_settings.workspace);
					_panel.unitBody = $('<img/>', {
						src: _panel.content
					}).appendTo(_panel.unit);
					break;
			}

			if(_desktop.lock)
				_panel.unit.css( { position: 'absolute' } );
			else
				_panel.unit.css( { position: 'fixed' } );



			if(typeof this.width !== 'undefined' && typeof this.height !== 'undefined') {
				this.x = this.x - this.width/2;
				this.y = this.y - this.height/2;
			}
			_panel.unit.css( { left: this.x, top: this.y, zIndex: count	} );
			_panel.unit.fadeIn(_settings.animationSpeed);
		},
		destroy: function() {
			var _panel = this;
			this.unit.fadeOut(_settings.animationSpeed, function(){
				if(_panel.modal && _settings.mobileMode) _controller.unblockWorkspace();
				_panel.unit.remove();						//Delete DOM
				delete _model.panels[_panel.index];
				delete _panel;								//Delete this Panel object
			});
		}
	});

	var _settings = Lancet.Settings;
	var _classes = Lancet.Settings.classes;
	var _catalogies = Lancet.Settings.catalogies;
	var _colors = Lancet.Settings.colors;
	var _components = Lancet.Components;
	var _controller = Lancet.Controller;
	var _console = Lancet.Controller.console;
	var _model = Lancet.Model;
	var _mouse = Lancet.Controller.mouse;
	var _timeline = _controller.timeline;
	var _desktop = Lancet.Model.desktop;
}).call(this);

$(function(){
    Lancet.initialize('settings');
});
//----------------------------------------------------------------------------------------------
