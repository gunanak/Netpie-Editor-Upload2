module.exports = function(app) {
	var http = require('http');
	var mongo = require("mongoskin");
	var ObjectID = mongo.ObjectID;
	var db = mongo.db("mongodb://testdb:NETPIE_test_mongo2017@s5.netpie.io:27077/netpie_test", {native_parser:true});


	var Promise = require("bluebird");
	var mongoskin = require("mongoskin");
	Object.keys(mongoskin).forEach(function(key) {
	  var value = mongoskin[key];
	  if (typeof value === "function") {
	    Promise.promisifyAll(value);
	    Promise.promisifyAll(value.prototype);
	  }
	});
	Promise.promisifyAll(mongoskin);

	// var rp = require('request-promise');

	app.get('/ggg', function(req, res, next) {
		// console.log(req.params.name)
		var uid = '592bbb5dca3368e704d17b2c';
		var str_uid = new ObjectID(uid)
		var a = 6;
		db.collection('user_file').find().toArrayAsync()
		  .then(function(doc) {
		    if (doc) {
		    	db.collection('user_directory').find({uid:str_uid},(err,result)=>{
					if(!err){
						a = 7;
									// return res.json(result)
					}else console.log('get userdata error : '+err);
				})
		      return db.collection('user_file').find().toArrayAsync();
		    }
		  })
		  .then(function(doc) {
		    if (doc) {
		    	console.log('2'+a);
		      return db.collection('user_file').find().toArrayAsync();
		    }
		  })
		  .then(function(doc) {
		    if (doc) {
		    	console.log('3');
		      return db.collection('user_file').find().toArrayAsync();
		    }
		  });
		next();
	});

	function tokenauth(token){

	 	var rp = require('request-promise');
	 	var value = false;

 
		rp("http://testwww.netpie.io:8080/api/tokeninfo/web/"+token)
	    .then(function (repos) {
	    	console.log(repos);
	    	value = true;
	    })
	    .catch(function (err) {
	        // API call failed... 
	    })
	    .finally(function () {
        // This is called after the request finishes either successful or not successful. 
        	if(value == true){
        		return 5
        	}

    	});
	   	// if(value == )

	}

	app.get('/api/:token', function(req, res, next) {
		
		var token = req.params.token
	 	var value = false;
	 	var uid = "592bbb5dca3368e704d17b2c";
	 	// var rp = require('request-promise');
	 	// rp("http://testwww.netpie.io:8080/api/tokeninfo/web/"+token)
		 // .then(function (repos) {
	  //   	value = JSON.parse(repos);
	  //   	uid = value.data.uid;
	  //   })
	  //   .catch(function (err) {
	  //       // API call failed... 
	  //   })
	  //   .finally(function () {
   //      // This is called after the request finishes either successful or not successful. 
   //      	if(uid != undefined){
   //      	var str_uid = new ObjectID(uid)
   //      }
   //  	});
   		    var str_uid = new ObjectID(uid)
			var d = new Date();
        	db.collection('user_directory').findOne({uid:str_uid}, function(err,result) {     
        	if(!err) {
        		if(result == null){
					//insert directory
					var msg = { '_id' : new ObjectID(),
                                'uid' : str_uid,
                                'lastupdate' : d.getTime(),
                                'structure' : {
                                   'folder' : [],
                                   'file' : []
                                }
							}
					db.collection('user_directory').insert(msg, function(err) {     
        				if(!err) console.log('insert directory success');
       			 		else console.log('insert directory error : '+err);
        				db.close();
					});

				}
				//get UserData
				db.collection('user_directory').findOne({uid:str_uid},(err,result)=>{
					if(!err){
						var file = result.structure.file;
						var i = file.length;
						var folder = result.structure.folder;

						var j = folder.length;
						var dataFolder = [];

						var ansfile = [];
						var ansfname = [];
				
						if(i > 0 || j > 0){
							// case file at File
							db.collection('user_file').find().toArrayAsync()
							 	.then(function(doc) {
								    if (doc) {
								    	if(i > 0){
								    	while(i--){
								    		db.collection('user_file').distinct('filename',{_id:file[i]},{uid:str_uid},(err,resp)=>{
												ansfile.push(resp[0]);
											})
								    	}}
								    	if(j > 0){
								    		while(j--){	
												dataFolder.push(folder[j]);
											}

								    	}	

								      return db.collection('user_file').find().toArrayAsync();
								    }
								})
								.then(function(doc) {
								    if (doc) {
								    	if(file.length > 0){ 
								    		result.structure.file = ansfile; 
								    	}
								    	var l = dataFolder.length;
								    	if(l > 0){
								    		var buffer = [];
								    		db.collection('user_file').find().toArrayAsync()
								    		.then((doc)=>{
								    			if(doc){
									    			for(var i = 0; i < l ; i++){
									    			var m = dataFolder[i].file.length;
									    			while(m--){
									    				db.collection('user_file').distinct('filename',{_id:dataFolder[i].file[m]},{uid:str_uid},(err,resp)=>{
									    					buffer.push(resp[0])
														})
									    			}
								    			}
								    			return db.collection('user_file').find().toArrayAsync();
								    		}
								    		}).then((doc)=>{
								    			if(doc){
								    				var indexBuf = 0;
									    			for(var i = 0; i < l ; i++){
									    			var m = dataFolder[i].file.length;
									    			while(m--){
									    				dataFolder[i].file[m] = buffer[indexBuf];
									    				indexBuf += 1;
									    			}
									    			}
									    			return db.collection('user_file').find().toArrayAsync();
								    			}
								    		}).then((doc)=>{
								    			if(doc){
								    				return res.json(result);
								    				return db.collection('user_file').find().toArrayAsync();
								    			}
								    		})
								    		
								    	}else{
								    		return res.json(result);
								    	}
						
								      return db.collection('user_file').find().toArrayAsync();
								    }
								})
								
						}
						else{
							return res.json(result);	
						}
								
					}else console.log('get userdata error : '+err);
				})			
        	}
        	else console.log('check user error : '+err);
        	db.close();
			});
		next();
	});

	app.post('/api/upload',function(req,res,next){
		var uid = '592bbb5dca3368e704d17b2c';
		var str_uid = new ObjectID(uid)

		var filename = req.params.fileName;
		var contents = req.params.contents;
		var date = req.params.date;
		var usid = req.params.usid;
		var d = new Date();
		var fname = 'b';
		var sname = null;


		db.collection('user_file').findOne({uid:str_uid,filename:filename},(err,result)=>{
			if(err){console.log(err)}
			else{
				if(result != null){
					db.collection('user_file').update({uid:str_uid,filename:filename},{$set:{content:contents}},(err)=>{
						if(err){console.log(err)};
					})
				}else{
							//insert file
					db.collection('user_directory').findOne({'uid':str_uid}, function(err,ud){
						var state = 0;
					    if(!err && ud){ 
					    	//state = 0 is make folder for file
					    	if(state == 0){
					    		if(fname != null){
					    			db.collection('user_directory').distinct('structure.folder.f_name',{uid:str_uid},(err,result)=>{
	
					    				var b = result.toString();
			    						var c = b.split(',');
			    						var indexF = c.indexOf(fname);
			    						var indexSF;
			    						if(indexF != -1){
			    							if(sname != null){
				    							db.collection('user_directory').distinct('structure.folder.subfolder.s_name',{uid:str_uid},(err,result)=>{
				    								var e = result.toString();
				    								var g = e.split(',');
				    								indexSF = g.indexOf(sname);
				    								if(indexSF == -1 ){
				    									db.collection('user_directory').update({uid:str_uid},{$push:{['structure.folder.'+indexF+".subfolder"]:{s_name:sname,file:[]}}},(err)=>{
				    										if(err){ console.log(err); }
				    									})
				    								}
				    							})
			    							}
			    							
			    						}else{
			    							if(sname != null){
				    							db.collection('user_directory').update({uid:str_uid},{$push:{'structure.folder':{f_name:fname,file:[],subfolder:[{s_name:sname,file:[]}]}}},(err)=>{
				    								if(err){ console.log(err); }
				    							});	
			    							}else{
			    								db.collection('user_directory').update({uid:str_uid},{$push:{'structure.folder':{f_name:fname,file:[]}}},(err)=>{
				    								if(err){ console.log(err); }
				    							})
			    							}
			    						}
					    			})
					    			// state = 1;
					    		}
					    		
					    	}

					    	//insert file
					    	db.collection('user_file').findOne({uid:str_uid,filename:filename},(err,result)=>{
					    		if(err){console.log(err)}
					    		else {
					    			if(result == null){
					    				var new_id = new ObjectID();
								        var msg = { '_id' : new_id,
								                'udid' : ud._id,
								                'uid' : new ObjectID(str_uid),
								                'lastupdate' : d.getTime(),
								                'content' : contents,
								                'filename' : filename
								        }
								        db.collection('user_file').insert(msg, function(err) {  
								            if(!err){ 
								                console.log('insert file success');
								                if(fname == null && sname == null){
								                	db.collection('user_directory').update({'_id':ud._id},{$push:{'structure.file':new_id}},function(err){
								                    	if(!err) console.log('update directory success');
								                    	else console.log('update directory error : '+err);
								                    	db.close();
								                	}); 
								                }
								                else if(fname != null && sname == null){
							    					console.log('2');
							    					var indexF;
							    					db.collection('user_directory').update({uid:str_uid,"structure.folder.f_name": fname},{$addToSet:{'structure.folder.$.file':new_id}},(err,result)=>{
														console.log('update success');
													})
							    				}
							    				else if(folder != null && subfolder != null){
							    					console.log('3');
							    					var indexF;
							    					var indexSF;
							    					User.find({uid:id},(err,result)=>{
														indexF = result[0].structure.folder.findIndex(i => i.f_name === fname);
													}).then((e)=>{
														User.update({uid:id,["structure.folder."+ indexF +".subfolder.s_name"]: sname},{$addToSet:{["structure.folder."+ indexF +".subfolder.$.file"]:ufid}},(err,result)=>{
							    							console.log(result);
							    						})
													})
							    				}    
								            }
								            else{ 
								                console.log('insert file error : '+err);
								                db.close();
								            }
								        });
					    			}
					    		}
					    	})
					    }    
					    else{
					        console.log('insert directory before : '+err);
					        db.close();
					    }
					});

				}
			}
		})


		return res.send('success');
		next();
	});

	app.get('/api/getallfile/:token',function(req,res,next){
		var token = req.params.token;
		var value = false;
	 	var uid ;
	 	var rp = require('request-promise');
	 	rp("http://testwww.netpie.io:8080/api/tokeninfo/web/"+token)
			.then(function (repos) {
	    		value = JSON.parse(repos);
	    		uid = value.data.uid;
	    	})
	    	.catch(function (err) {
	       		// API call failed... 
	    	})
	    	.finally(function () {
	    		if(uid != undefined){
			        var str_uid = new ObjectID(uid);
					db.collection('user_file').distinct('filename',{uid:str_uid},(err,result)=>{
						if(err){ console.log(err)
							return res.send('err');}
						else{
							return res.json(result)
						}
					})
				}
      		});
		next();
	})

	app.post('/api/getcontent',function(req,res,next){
		var token = req.params.token;
		var filename = req.params.filename;
		console.log('token'+token)
		var rp = require('request-promise');
	 	rp("http://testwww.netpie.io:8080/api/tokeninfo/web/"+token)
			.then(function (repos) {
	    		value = JSON.parse(repos);
	    		uid = value.data.uid;
	    	})
	    	.catch(function (err) {
	       		// API call failed... 
	    	})
	    	.finally(function () {
	    		if(uid != undefined){
			        var str_uid = new ObjectID(uid);
					db.collection('user_file').distinct('content',{filename:filename,uid:str_uid},(err,result)=>{
						if(err){ console.log(err)
							return res.send('err');}
						else{
							console.log(result)
							return res.json(result)
						}
					})
				}
      		});
	})


}