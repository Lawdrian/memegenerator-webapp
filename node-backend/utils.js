const archiver = require('archiver');
const { PassThrough } = require('stream');

// Create a zip archive containing the memes and metadata
function createZipArchive(memes, callback) {
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  const output = new PassThrough();

  archive.on('error', (err) => {
      callback(err);
  });

  memes.forEach((meme, index) => {
      const base64Data = meme.content.replace(/^data:image\/png;base64,/, "");
      const imageData = Buffer.from(base64Data, 'base64');
      archive.append(imageData, { name: `image_${index}.png` });
  });

  // Include metadata in a JSON file
  const metadataJson = JSON.stringify(memes.map(meme => 
      {
          return(
              { 
                  name: meme.name,
                  description: meme.description,
                  format: meme.format,
                  privacy: meme.privacy,
                  createdAt: meme.createdAt
              }
          )
      }), null, 2);
  archive.append(metadataJson, { name: 'metadata.json' });

  // Finalize the archive immediately after appending all data
  archive.finalize();

  // Pipe the archive data to the output stream
  archive.pipe(output);

  // Call the callback with the output stream
  callback(null, output);
}


module.exports = {
    createZipArchive: createZipArchive
};