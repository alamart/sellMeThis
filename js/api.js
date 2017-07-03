var API_URL = 'https://haag4kee92.execute-api.eu-west-2.amazonaws.com/prod';
$(document).ready(function(){
	$.ajax({
		type: 'GET',
		url: API_URL + '/keywords',
		success: function(data){

			$('#word-proposition').html('');
			$('#latest-arguments').html('');
			$('#keywords-list').html('');
			

			/*data.forEach(function(keywordItem){
				$('#word-proposition').append("<p>" + keywordItem.Article + ' ' +keywordItem.Keyword + "</p>");
				return keywordItem;
			})*/

			data.some(function(keywordItem) {
			  $('#word-proposition').append("<p>" + keywordItem.Article + ' ' +keywordItem.Keyword + "</p>");
			  $('#keyword_id').val(keywordItem.UUID);
			  $('#keywordTimestamp').val(keywordItem.KeywordTimestamp);
			  
			  return 1==1;
			});


			data.some(function(keywordItem) {
				var $this = keywordItem;
				$('#keywords-list').append('<li><a href="/define.php?term=Brooklan">' + $this.Keyword + '</a></li>');
			    
				$this.Arguments.some(function(argumentItem){
			        $('#latest-arguments').append(
				  	'<div class="col-lg-6"><h4>'+ $this.Keyword +'</h4><p>' + argumentItem.Text + '</p></div>'
				  	);
			    });
			  
			  
			});

			
		}
	});
});

$('#submitArgument').on('click', function(){
	$.ajax({
		type: 'POST',
		url: API_URL + '/argument',
		data: JSON.stringify({
								"Text": $('#argument').val(), 
								"Keyword_id": $('#keyword_id').val(),
								"KeywordTimestamp":$('#keywordTimestamp').val()
							}),
		contentType:"application/json",

		success: function(data){
			location.reload();
		}
	});

	return false;
});