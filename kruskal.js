var kruskal = function(params,callback){
	var k = this; // get instance
	
	k.nodelist = []; // nodelist
	k.callback = callback;
	k.edges = []; // edgelist
	k.keepedges = []; // edges that we want to keep
	
	// create edge kects
	params.edges.forEach(function(edge,i){
		k.edges.push({id : i, connecting : [edge[0],edge[1]],nodelist : [edge[0],edge[1]], length : edge[2]});
		});
		
	// sort edges by length
	k.sort_edges();
	
	// run
	k.get_edge();
};

kruskal.prototype = {

	sort_edges : function(){
		var k = this; // get instance
		k.edges.sort(function(a,b){
			return b.length - a.length; // sort edges in ascending order (so smallest can be removed with pop() )
			});
	},
	
	get_edge : function(){
		
		var k = this; // get instance
		if(k.edges.length > 0){ // check current edge
			k.test_edge( k.edges.pop() );
		}else{ // no more edges left -> finished!!!
		
			var result = [];
			k.keepedges.forEach(function(edge){
				result.push(edge.connecting);
				});
		
			if(typeof(k.callback) == "function"){
				k.callback( result ); // call callback function and pass result
			}
			
			k.draw();
		}
	},
	
	test_edge : function(edge){
	
		var k = this; // get instance
		
		if(k.keepedges.length == 0){ // add first edge
			k.keepedges.push(edge);
		}else{
			// check against other edges
			var found_1 = [];
			var found_2 = [];
			var found = false;
			
			k.keepedges.forEach(function(keepedge){
					if(keepedge.nodelist.indexOf(edge.connecting[0]) != -1 && keepedge.nodelist.indexOf(edge.connecting[1]) != -1){
						// both nodes are already in edge!!
						found = true; // set found to true
					}else if(keepedge.nodelist.indexOf(edge.connecting[0]) != -1){
						// first node found!
						found_1.push(keepedge);
					}else if(keepedge.nodelist.indexOf(edge.connecting[1]) != -1){
						// second node found
						found_2.push(keepedge);
					}
				});
				
			if(found == false && found_1.length == 0 && found_2.length == 0){ // edge is good to go
				k.keepedges.push(edge); // add edge
			}else if(found == false){ // 
			
				found_2.forEach(function(keepedge){
						keepedge.nodelist.push(edge.connecting[0]); // update edge with node 1
					});
					
				found_1.forEach(function(keepedge){
						keepedge.nodelist.push(edge.connecting[1]); // update edge with node 2
					});
					
				k.keepedges.push(edge); // add edge
			}
		}
		// clean edges (remove edges where one nodeset contains another)
		k.clean_edgelist();
		
		// get next edge
		k.get_edge();
	},
	
	clean_edgelist : function(){

		var k = this; // get instance

		// loop edges
		k.keepedges.forEach(function(e1,i){
			k.keepedges.forEach(function(e2){
				if(e1.id != e2.id){ // edges are not the same -> check for overlap
					
					// check for overlap
					var result = [e1.nodelist,e2.nodelist].shift().filter(function(v) {
						return [e1.nodelist,e2.nodelist].every(function(a) {
							return a.indexOf(v) !== -1;
						});
					});
				
					if(result.length > 1){ // more then 2 nodes are the same array -> concat arrays and get unique values!
						e1.nodelist = e1.nodelist.concat(e2.nodelist); // concat arrays
						e1.nodelist = k.uniq( e1.nodelist ); // delete duplicates


						e2.nodelist = e2.nodelist.concat(e1.nodelist); // concat arrays
						e2.nodelist = k.uniq( e2.nodelist ); // delete duplicates
						}
					}
				});
			});
	},
	
	uniq(a) {
		var result = [];
		a.forEach(function(item) {
			 if(result.indexOf(item) < 0) {
				 result.push(item);
			 }
		});
		return result;
	}
};
