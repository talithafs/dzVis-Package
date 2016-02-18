services.service("databasetree", function(){ 
	return DatabaseTree.getInstance(); 
});

var DatabaseTree = (function(){
	
	// Single instance
	var instance ;
	
	// Private variables
	var source = undefined ;
	var treeInstance = undefined ;
	var lastColumn = undefined ;
	
	var currentAttr = undefined ;
	var currentTable = undefined ;
	
	// Public variable
	var $tree = $("#tree") ;
	
	//Constructor 
	function DatabaseTree(){ };
	
	// Private functions 
	function createInstance() {
        var object = new DatabaseTree();
        return object;
    }
    
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
	
	 
    function getLastColumn(){
    	var items = treeInstance.get_checked(true) ;
    	var dim = items.length ;
    	
    	// Return an error if 'items' is empty
    	if(dim == 0){
    		return "Error: there are no checked nodes.";
    	}
    	
    	return getColumn(items[dim-1]);
    }
    
    
    function getColumn(item) {
		var node = undefined ;
		var index ;

		// Return an error if 'item' is empty
		if(item == undefined){
			return "Error: parameter is empty." ;
		}

		// If the last selected node is a leaf, meaning it's not an attribute, but a level, get its parent through its id  		
		if(item.type == "lvl"){
			node = treeInstance.get_node(item.parent);
			
			// If 'node' is undefined, there is something wrong with the tree. Return an error.
			if(node == undefined){
				return "Error: Leaf node has no parent.";
			}
		}
		else {
			node = item ;
		}
		
		// Get checked nodes and find 'node's checked children, in the order they were checked
		// Only the state of the node indicates if it's really checked. The jstree built-in list of checked nodes may not have been updated yet (i.e. when calling getColumn() inside a jstree.node_checked or jstree.node_unchecked event handler), but it preserves the order in which the nodes were checked.
		var checked = getCheckedNodes();
		
		var levels = jQuery.map(checked, function(obj){
				
				if(obj.parent === node.id) return obj ;
		});
		
		// Create a list of child nodes
		node.levels = [] ;
		
		for(index in levels){
			if(levels[index].state.checked === true){
				node.levels.push(levels[index]);
			}
		}
		
		// Return node
		return node ;
	};
	
	function getLastTable(){
		var items = treeInstance.get_checked(true) ;
    	var dim = items.length ;
    	
    	// Return an error if 'items' is empty
    	if(dim == 0){
    		return "Error: there are no checked nodes.";
    	}
    	
    	return getTable(items[dim-1]);
	}

	function getTable(item){
		var node = undefined ;
		
		// Return an error if 'item' is empty
		if(item == undefined){
			return "Error: parameter is empty." ;
		}
		
		// If 'item' is already a root node, return its original
		if(item.type != "attr" && item.type != "lvl"){
			return item ;
		} 

		// Get 'item's parent. If it is an attribute, get its parent, a table node. 
		node = treeInstance.get_node(item.parent) ;
		
		if(node.type == "attr"){
			node = treeInstance.get_node(node.parent) ;
		} 
		
		// If 'node' is undefined, there is something wrong with the tree. Return an error.
		if(node == undefined){
			return "Error: Table is undefined";
		}
		
		// Return the original node
		return node ;

	} ;
	
	function getCheckedColumns(){
		
		var checked = getCheckedNodes();
		var columns = [] ;
		var index ;
		var col = undefined ;

		
		for(index in checked){
			node = checked[index] ;
			
			col = jQuery.map(columns, function(obj){
					 if(obj.id === node.id){ return obj ; } 
				  })[0] ;
 						 	 
			if(col == undefined){
				columns.push(getColumn(node));
			}
		}

		return columns ;
	}
	
	function getTreeNode(id){
		return treeInstance.get_node(id) ;
	}
	
	function getOriginalNode(id){
		return treeInstance.get_node(id).original ;
	}
	
	function checkNode(id){	
		treeInstance.check_node(treeInstance.get_node(id)) ;
	}
	
	function uncheckNode(id){	
		treeInstance.uncheck_node(treeInstance.get_node(id)) ;
	}
	
	function enableNode(node){
		
		if(typeof node === "string"){
			node = getTreeNode(node);
		}
		
		treeInstance.enable_node(node);
	}
	
	function disableNode(node){
		
		if(typeof node === "string"){
			node = getTreeNode(node);
		}
		
		treeInstance.uncheck_node(node);
		treeInstance.disable_node(node);
	}
	
	function enableCheckbox(node, check){
		
		if(typeof node === "string"){
			node = getTreeNode(node);
		}
		
		treeInstance.enable_checkbox(node);
		
		if(check){
			treeInstance.check_node(node);
		}
	}
	
	function disableCheckbox(node, uncheck){
		
		if(typeof node === "string"){
			node = getTreeNode(node);
		}
		
		if(uncheck){
			treeInstance.uncheck_node(node);
		}
		
		treeInstance.disable_checkbox(node);
	}
	
	function startWaiting(){
		
		alert("called start");
		
		$tree.addClass("wait");
	}
	
	function stopWaiting(){
		
		alert("called stop");
		
		$tree.removeClass("wait");
	}
	
	function search(text){
		
		treeInstance.search(text);
	}
	
	function getCheckedNodes(){
		
		return treeInstance.get_checked(true);
	}
	
	
	// DatabaseTree public API
	DatabaseTree.prototype.$tree = $tree ;
	
	DatabaseTree.prototype.create = function(jsonFile){ 
		create.call(this, jsonFile);
	};
	
	DatabaseTree.prototype.getColumn = function(item){ 
		return getColumn.call(this,item); 
	};
	
	DatabaseTree.prototype.getTable = function(item){ 
		return getTable.call(this,item); 
	};
	
	DatabaseTree.prototype.getLastColumn = function(){ 
		return getLastColumn.call(this); 
	};
	
	DatabaseTree.prototype.getLastTable = function(){ 
		return getLastTable.call(this); 
	};
	
	DatabaseTree.prototype.getOriginalNode = function(id){ 
		return getOriginalNode.call(this,id); 
	};
	
	DatabaseTree.prototype.getTreeNode = function(id){ 
		return getTreeNode.call(this,id); 
	};
	
	DatabaseTree.prototype.enableNode = function(node){ 
		enableNode.call(this, node);
	};
	
	DatabaseTree.prototype.disableNode = function(node){ 
		disableNode.call(this, node);
	};
	
	DatabaseTree.prototype.enableCheckbox = function(node, check){ 
		enableCheckbox.call(this, node, check);
	};
	
	DatabaseTree.prototype.disableCheckbox = function(node, uncheck){ 
		disableCheckbox.call(this, node, uncheck);
	};
	
	DatabaseTree.prototype.startWaiting = function(){ 
		startWaiting.call(this); 
	};
	
	DatabaseTree.prototype.stopWaiting = function(){ 
		stopWaiting.call(this); 
	};
	
	DatabaseTree.prototype.search = function(text){ 
		search.call(this, text);
	};
	
	DatabaseTree.prototype.getCheckedNodes = function(){ 
		return getCheckedNodes.call(this); 
	};
	
	DatabaseTree.prototype.getCheckedColumns = function(){ 
		return getCheckedColumns.call(this); 
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