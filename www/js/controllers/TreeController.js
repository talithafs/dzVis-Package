/**
 * @fileOverview Definition of the TreeController. It manages events associated with the jstree
 * @author Talitha Speranza
 * @version 0.1
 */

/** @class 
 *	@name TreeController */
application.controller("TreeController",["$scope", "databasetree", function($scope, databaseTree){
	
	databaseTree.create('data/menu.json');
	
	var lastTable = undefined ;
	
	/** @fires TreeController#treeClicked */
	$scope.treeClicked = function(){
		
		/** 
		 * Reports that the jstree element was clicked
		 * @event TreeController#treeClicked
     	 * @type {Array.<DatabaseTree~TreeNode>}
     	 */		
		$scope.$parent.$broadcast("treeClicked",databaseTree.getCheckedNodes());
	} ;
	
	/** @fires TreeController#nodeChecked */ 
	databaseTree.$tree.on("check_node.jstree", function(event, data){
		
		var table = databaseTree.getTable(data.node);
		
		if(table != lastTable){
			databaseTree.manageTables(table.id);
			lastTable = table ;
		}
		
		/** 
		 * Reports that a node was checked in the jstree
		 * @event TreeController#nodeChecked
     	 * @type {DatabaseTree~TreeNode}
     	 */
		$scope.$parent.$broadcast("nodeChecked", data.node);
	});
	
	/** @fires TreeController#nodeUnchecked*/
	databaseTree.$tree.on("uncheck_node.jstree", function(event, data){
		
		var checked = databaseTree.getCheckedNodes();
		
		if(checked.length == 0){
			lastTable = undefined ;
			databaseTree.manageTables();
		}
		
		/** 
		 * Reports that a node was checked in the jstree
		 * @event TreeController#nodeUnchecked
     	 * @type {DatabaseTree~TreeNode}
     	 */
		$scope.$parent.$broadcast("nodeUnchecked", data.node);
	});
	
	
}]);