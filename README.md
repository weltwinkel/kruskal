# kruskal

Very basic implementation of the kruskal algorithm in JavaScript.

Initialize using:

	k = new kruskal({
		nodes : ["a","b","c","d"],
		edges : [
		    ["a","b",3],
		    ["a","c",5],
		    ["d","b",8]
		]
	},function(edgelist){
	
		// callback function returns:
		// edgelist = [
		//     ["a","b"],
	    //     ["a","c"],
	    //     ["d","b"],
		// ];
		
	});
