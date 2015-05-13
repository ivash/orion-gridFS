var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
  useHTTP: true,
  httpHeaders: [
    ['Cache-Control', 'public, max-age=31536000']
  ],
 stores: [imageStore],
  filter: {
    maxSize: 1000000,
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF']
    }
  }
});

Images.deny({
  insert: function(){
    return false;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return false;
  },
  download: function(){
    return false;
  }
  });

Images.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  },
  download: function(){
    return true;
  }
});

if (Meteor.isClient) {
  orion.filesystem.providerUpload = function(options, success, failure) {

    // Handle multiple files upload
    _.each(options.fileList, function(file) {
  
      // If you want to upload different types of files to different FS.Collection, 
      // do extension check first
      // var fileName = file.name;
      // var isImage = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(fileName);
      // var isTorrent = (/\.(torrent)$/i).test(fileName);
  
      // Use FS.Collection (Files) to upload the file
      Images.insert(file, function(err, file) {
        if (err) {
          console.log('error', err);
        } else {
          // recreate upload file pattern
          var fileUrl = Meteor.absoluteUrl() + "cfs/files/images/" + file._id + "/" + file.original.name;
  
          console.log(fileUrl);
  
          var meta = {
            cfs_id : file._id,
            ext    : file.extension()
          };
          success(fileUrl, meta);
        }
  
      })
    });
  }

  orion.filesystem.providerRemove = function(fileObj, success, failure) {
  
    var cfs_id = fileObj.meta.cfs_id;
  
    // remove record in cfs and the related file in directory
    // Here the Files.remove() requires cfs_id, not a FS.file
    Images.remove(cfs_id, function(err, fileObj) {
      if (err) {
        console.log('error', err);
      } else {
        console.log('remove success');
        success();  // remove record in orion
      };
    });
  }
}