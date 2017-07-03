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

			/*Init header page*/
			var keywordItem = data[Math.floor(Math.random()*data.length)];
			$('#word-proposition').append("<p>" + keywordItem.Article + ' ' +keywordItem.Keyword + "</p>");
			$('#keyword_id').val(keywordItem.UUID);
			$('#keywordTimestamp').val(keywordItem.KeywordTimestamp);
			  


			data.some(function(keywordItem) {
				var $this = keywordItem;
				$('#keywords-list').append('<li><a href="/define.php?term=Brooklan">' + $this.Keyword + '</a></li>');
			    
				$this.Arguments.some(function(argumentItem){
			        $('#latest-arguments').append(
				  	'<div class="col-lg-6">' +
				  		'<div class="card">' +
						    '<div class="card-block">' +
						      '<h4 class="card-title">' + $this.Keyword + '</h4>' +
						      '<p class="card-text">' + argumentItem.Text + '</p>' +
						      '<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>' +
						      '<div class="btn-group" data-toggle="buttons">' +
						      	'<label class="btn btn-primary active" aria-pressed="true">' +
							      '<input type="radio" name="options" id="option1" autocomplete="off"><i class="fa fa-thumbs-up" aria-hidden="true"></i>' +
							    '</label>' +
							    '<label class="btn btn-primary active" aria-pressed="true">' +
							      '<input type="radio" name="options" id="option2" autocomplete="off"><i class="fa fa-thumbs-down" aria-hidden="true"></i>' +
							    '</label>' +
						      '</div>' +
						    '</div>' +
						  '</div>' +
					'</div>'
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