var databaseTree = (function(){
	
	var source = undefined ;
	var instance = undefined ;
	var currentAttr = undefined ;
	var currentTable = undefined ;
	var $tree = $("#tree") ;
	
	var create = function(jsonFile){
		
		// Read JSON file
		$.getJSON(jsonFile, function(data) {
			
			// Save the JSON object 'data' in a private variable
			source = data ;
			
			// AJAX call to create a jstree instance
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
			  "plugins" : [
			    "types", "wholerow","checkbox", "search"
			  ]
			});
			
			// Save the jstree instance in a private variable
			instance = $tree.jstree(true) ;
		});
	};
	
	var getSource = function() {
		return source ;
	};
	
	var getInstance = function() {
		return instance;
	};
	
	var getCurrentAttr = function(itens){
		currentAttr = findAttr(itens);
		return currentAttr ;
	};
	
	var getCurrentTable = function(itens){
		currentTable = findTable(itens);
		return currentTable ;
	};
	
	var findAttr = function(itens) {
		var index = 0 ;
		var nodes, found = [] ;
		var dim = itens.length ;
		var searchId = 0 ;
		
		// Return an error if 'itens' is empty
		// If the last selected node is a leaf, meaning it's not an attribute, get its parent id 
		// If the last selected node is an atributte, get its own id
		// Note that, by design, a table node is never the last selected node
		if(dim == 0){
			return "Error: parameter is empty." ;
		}
		else if(itens[dim-1].type == "lvl") { 
			searchId = itens[dim-1].parent ; 
		}
		else {
			searchId = itens[dim-1].id ;
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

	var findTable = function(node){
		var found = [] ;
		var tableId = "" ;
		
		alert(node.type);
		
		// If 'node' is already a root node, return it
		if(node.type != "attr" && node.type != "lvl"){
			return node ;
		} 
		
		// If 'node' is a leaf, find its parent (an atrribute) and then its grandparent id (a table id)
		// Else, the node is an attribute, so get its parent id
		if(node.type == "lvl"){
			var attrNode = findAttr(node);
			tableId = instance.get_parent(attrNode);
		} 
		else {
			tableId = instance.get_parent(node);
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
	
	return {
		$tree : $tree,
		instance : instance,
		getInstance : getInstance,
		create : create,
		getSource : getSource,
		getCurrentAttr : getCurrentAttr,
		getCurrentTable : getCurrentTable 
	};
	
})();