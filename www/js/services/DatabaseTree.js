services.service("databasetree", function(){ 
	return DatabaseTree.getInstance(); 
});

var DatabaseTree = (function(){
	
	// Single instance
	var instance ;
	
	// Private variables
	var source = undefined ;
	var treeInstance = undefined ;
	var currentAttr = undefined ;
	var currentTable = undefined ;
	
	// Public variable
	var $tree = $("#tree") ;
	
	// Protected variables
	var properties = {
		get source(){
			return source ;
		},
		get treeInstance(){
			return treeInstance ;
		},
		get domElement(){
			return $tree ;
		}
	};
	
	//Constructor 
	function DatabaseTree(){ };
	
	// Private functions 
	function createInstance() {
        var object = new DatabaseTree();
        return object;
    }
    
    function findAttr(itens) {
		var index = 0 ;
		var nodes, found = [] ;
		var dim = itens.length ;
		var searchId = 0 ;
		
		if(itens instanceof Array){
			item = itens[dim-1] ;
		}
		else {
			item = itens ;
		} 
		
		// Return an error if 'itens' is empty
		// If the last selected node is a leaf, meaning it's not an attribute, get its parent id 
		// If the last selected node is an atributte, get its own id
		// Note that, by design, a table node is never the last selected node
		if(dim == 0){
			return "Error: parameter is empty." ;
		}
		else if(item.type == "lvl") { 
			searchId = item.parent ; 
		}
		else {
			searchId = item.id ;
		}
	
		// For each top node in the whole tree (json object 'source'), 
		// search its children for the selected node
		for(index in source){
			nodes = jQuery.map(source[index].children, function(obj) {
				if(obj.id === searchId) { return obj ; }
			});
			
			// jQuery.map returns a list, so it suffices to check only the first item 
			if(nodes[0] != undefined){
				found = found.concat(nodes);
			}
		}
		
		// There should be only one match (ids must be unique)
		if(found.length != 1) { return "Error: Found" + found.length + " nodes of the type \'attr\' with the same id." ; };
		
		// Return the node itself ('found' is a one element list)
		return found[0] ;
	};

	function findTable(node){
		var found = [] ;
		var tableId = "" ;
		
		// If 'node' is already a root node, return it
		if(node.type != "attr" && node.type != "lvl"){
			return node ;
		} 
		
		// If 'node' is a leaf, find its parent (an atrribute) and then its grandparent id (a table id)
		// Else, the node is an attribute, so get its parent id
		if(node.type == "lvl"){
			var attrNode = findAttr(node);
			tableId = treeInstance.get_parent(attrNode);
		} 
		else {
			tableId = treeInstance.get_parent(node);
		}

		// Map root nodes (tables) to retrieve the entire root node object
		found = jQuery.map(source, function(obj){
			if(obj.id === tableId){ return obj ; }
		});
		
		// There should be only one match (ids must be unique)
		if(found.length != 1) { return "Error: Found " + found.length + " nodes of type \'root\' with the same id." ; };
		
		// Return the node itself ('found' is a one element list)
		return found[0] ;
	} ;
	
	// Protected functions
	function create(jsonFile) {

		// Read JSON file
		$.getJSON(jsonFile, function(data) {
			
			// Save the JSON object 'data' in a private variable
			source = data ;
			
			// AJAX call to create a jstree treeInstance
			$tree.jstree({
			  "core" : {
				 'data' : source
			  },
			  "types" : {
			    "attr" : {
			      "icon" : "img/attr.png",
			      "valid_children" : ["lvl"]
			    },
			    "lvl" : {
			      "icon" : "img/level.png",
			      "valid_children" : []
			    }
			  },
			  "checkbox" : {
            	"tie_selection" : false
        	  },
			  "plugins" : [
			    "types", "wholerow","checkbox", "search"
			  ]
			});
			
			// Save the jstree treeInstance in a private variable
			treeInstance = $tree.jstree(true) ;
		});
	};
	
	function getCurrentAttr(itens){
		currentAttr = findAttr(itens);
		return currentAttr ;
	};
	
	function getCurrentTable(itens){
		currentTable = findTable(itens);
		return currentTable ;
	};
	
	// DatabaseTree public API
	DatabaseTree.prototype.properties = properties ;
	DatabaseTree.prototype.$tree = $tree ;
	
	DatabaseTree.prototype.create = function(jsonFile){ 
		create.call(this, jsonFile);
	};
	
	DatabaseTree.prototype.getCurrentAttr = function(itens){ 
		return getCurrentAttr.call(this,itens); 
	};
	
	DatabaseTree.prototype.getCurrentTable = function(itens){ 
		return getCurrentTable.call(this,itens); 
	};

	return {
        getInstance: function () { 
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
}());