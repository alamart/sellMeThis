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
				$('#keywords-list').append(
					'<div class="card p-3">' +
						    '<span>' + $this.Keyword + '</span>' +
						  '</div>' 

						   );
			    
			});

			
		}
	});
	$.ajax({
		type: 'GET',
		url: API_URL + '/arguments',
		success: function(data){

			$('#latest-arguments').html('');
			var mainKeyword = data.Keyword;
	        data.Items.some(function(argumentItem) {
				var $this = argumentItem;
				
			        $('#latest-arguments').append(
				  		'<div class="card p-3" data-argumentUUID="' + argumentItem.Keyworduuid + '" data-argumentTimeStamp="' + argumentItem.ArgumentTimestamp + '">' +
						    '<div class="card-block">' +
						      '<h4 class="card-title">' + argumentItem.Keyword.Keyword + '</h4>' +
						      '<p class="card-text">' + argumentItem.Text + '</p>' +
						      '<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>' +
						      '<div class="btn-group thumbs" data-toggle="buttons">' +
						      	'<label class="btn btn-primary active" aria-pressed="true">' +
							      '<input type="radio" name="options" data-rate="Up" data-keyid="' + argumentItem.Keyworduuid + '" data-argid="' + argumentItem.ArgumentTimestamp + '" data-upvote autocomplete="off"><i class="fa fa-thumbs-up" aria-hidden="true"></i> <span data-argid="' + argumentItem.ArgumentTimestamp + '" class="upspan">' + argumentItem.Up +'</span>'+
							    '</label>' +
							    '<label class="btn btn-primary active" aria-pressed="true">' +
							      '<input type="radio" name="options" data-rate="Down" data-keyid="' + argumentItem.Keyworduuid + '" data-argid="' + argumentItem.ArgumentTimestamp + '" data-downvote autocomplete="off"><i class="fa fa-thumbs-down" aria-hidden="true"></i> <span data-argid="' + argumentItem.ArgumentTimestamp + '" class="downspan">' + argumentItem.Down +'</span>'+
							    '</label>' +
						      '</div>' +
						    '</div>' +
						  '</div>' 

				  	);
			  
			});
			$('input[data-rate]').change(function() {
				$.ajax({
					type: 'POST',
					url: API_URL + '/vote',
					data: JSON.stringify({
											"Keyword_id": $(this).data('keyid'), 
											"Timestamp": $(this).data('argid'),
											"Rate":$(this).data('rate')
										}),
					contentType:"application/json",

					success: function(data){
						$('span[data-argid='+data.Argid+'][class=upspan]').html(data.Up);
						$('span[data-argid='+data.Argid+'][class=downspan]').html(data.Down);
					}
				});

				return false;
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







