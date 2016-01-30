var kruskal = function(params,callback){console.time("start");
	var k = this; // get instance
	
	k.nodelist = []; // nodelist
	k.callback = callback; // callback function to execute after completion
	k.edges = []; // edgelist
	k.keepedges = []; // edges that we want to keep
	
	// create edge kects
	params.edges.forEach(function(edge,i){
		k.edges.push({id : i, connecting : [edge[0],edge[1]],nodelist : [edge[0],edge[1]], length : edge[2]});
		});
		
	// sort edges by length
	k.sort_edges();

	var edges = k.edges.length; // get total number of edges
	
	// loop all edges
	for(var i = 0; i < edges; i++){
		k.test_edge(); // check every edge
		}
};

kruskal.prototype = {

	sort_edges : function(){
		var k = this; // get instance
		k.edges.sort(function(a,b){
			return b.length - a.length; // sort edges in descending order (so smallest can be removed with pop() )
			});
	},
	
	finished : function(){
		
		var k = this; // get instance

		var result = [];
		k.keepedges.forEach(function(edge){
			result.push(edge.connecting);
			});
	
		if(typeof(k.callback) == "function"){
			k.callback( result ); // call callback function and pass result
		}
	},
	
	test_edge : function(){
	
		var k = this; // get instance
		var edge = k.edges.pop();
		var current_edges = k.keepedges; // get array of current edges
		var new_edge,found_1,found_2,found;
		
		if(k.keepedges.length == 0){ // add first edge
			k.keepedges.push(edge);
		}else{
			// check against other edges
			found_1 = [], found_2 = [];
			var found = false; // default value
			
			k.keepedges.forEach(function(keepedge){
					if(keepedge.nodelist.indexOf(edge.connecting[0]) > -1 && keepedge.nodelist.indexOf(edge.connecting[1]) > -1){
						// both nodes are already in edge!!
						found = true; // set found to true
					}else if(keepedge.nodelist.indexOf(edge.connecting[0]) > -1){
						// first node found!
						found_1.push(keepedge);
					}else if(keepedge.nodelist.indexOf(edge.connecting[1]) > -1){
						// second node found
						found_2.push(keepedge);
					}
				});
				
			if(found == false && found_1.length == 0 && found_2.length == 0){ // edge is good to go
				new_edge = edge;
				k.keepedges.push(edge); // add edge
			}else if(found == false){ // 
			
				found_2.forEach(function(keepedge){
						keepedge.nodelist.push(edge.connecting[0]); // update edge with node 1
					});
					
				found_1.forEach(function(keepedge){
						keepedge.nodelist.push(edge.connecting[1]); // update edge with node 2
					});
					
				new_edge = edge;
				k.keepedges.push(edge); // add edge
			}
		}
		
		if(found == false){ // new edge was added -> clean list
			k.clean_edgelist(current_edges,new_edge);
		}
		
		if(k.edges.length == 0){
			k.finished(); // execution completed
			}
	},
	
	clean_edgelist : function(old_edges,new_edge){

		var k = this; // get instance
		var n1_tmp,n2_tmp,count; // define vars used in loop
	
		// loop edges (excluding last)
		old_edges.forEach(function(check_edge){
			
			n1_tmp  = []; // <- nodes that are contained in new_edge but NOT check_edge
			n2_tmp  = []; // <- nodes that are contained in check_edge but NOT new_edge
			count = 0; // count overlapping nodes between new_edge and check_edge
			
			// check for overlap
			new_edge.nodelist.forEach(function(n1){
				if(check_edge.nodelist.indexOf(n1) > -1){ // n2 contains n1
					count++;
				}else{ // n2 does not contain n1
					n2_tmp.push(n1);
				}
			});
			
			if(count > 1){ // join both edges!!
			
				check_edge.nodelist.forEach(function(n2){
					if(new_edge.nodelist.indexOf(n2) == -1){ // n1 does not contain n2
						n1_tmp.push(n2);
						}
					});

				new_edge.nodelist = new_edge.nodelist.concat(n1_tmp); // concat with differences from check_edge
				check_edge.nodelist = check_edge.nodelist.concat(n2_tmp); // concat with differences from new_edge
				}
			});
	}
};
