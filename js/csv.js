

  function isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      return true;
    } else {
      // source: File API availability - http://caniuse.com/#feat=fileapi
      // source: <output> availability - http://html5doctor.com/the-output-element/
      document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
      // 6.0 File API & 13.0 <output>
      document.writeln(' - Google Chrome: 13.0 or later<br />');
      // 3.6 File API & 6.0 <output>
      document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
      // 10.0 File API & 10.0 <output>
      document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
      // ? File API & 5.1 <output>
      document.writeln(' - Safari: Not supported<br />');
      // ? File API & 9.2 <output>
      document.writeln(' - Opera: Not supported');
      return false;
    }
  }

  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];

    // read the file metadata
    var output = ''
        output += '<span style="font-weight:bold;">File Statistics</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

    // read the file contents
    printTable(file);
	

    // post the results
    $('#list').html(output);

  }

  function printTable(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);
      var html = '';
	  var head = '';
	
      for(var row in data) {
	    if (row==0) {
			html += '<thead>\r\n';
	    } 
	
		if (row==1) {
			html += '<tbody>\r\n';
	    }
	
		html += '<tr>\r\n';
        for(var item in data[row]) {
	      if (row==0) {
	          head += '<th class="header">' + data[row][item] + '</th>\r\n';
		  } else {
	          html += '<td>' + data[row][item] + '</td>\r\n';
		  }
        }
		if (row==0) {
			html += head + '</tr>\r\n<tr class="autofilter">\r\n' + head + '</tr>\r\n';
		}
        html += '</tr>\r\n';

		if (row==0) {
			html += '</thead>\r\n';
	    } 
      }
	  html += '</tbody>\r\n';
      
	
	  $('#dataTable').html(html);

	  $('#dataTable').dataTable().columnFilter();

		$('#dataTable').dataTable( {
			"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }