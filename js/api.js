var API_URL = 'https://haag4kee92.execute-api.eu-west-2.amazonaws.com/prod';
var all_arguments = [];

var fun_elapsed = function(timestamp){
	var startTime = timestamp, endTime = Date.now();

	var timeDiff = endTime/1000 - startTime; //in s


	// get seconds
	var seconds = Math.round(timeDiff);
	if (seconds < 60) {
		return {unit:"seconds", value : seconds};
	}

	var minutes = Math.round((seconds/60));
	if (minutes < 60) {
		return {unit:"minutes", value : minutes};
	}

	var hours = Math.round((minutes/60));
	if (hours < 24) {
		return {unit:"hours", value : hours};
	}

	var days = Math.round((hours/24));
	if (days < 30) {
		return {unit:"days", value : days};
	}

	var weeks = Math.round((days/7));
	if (weeks < 4) {
		return {unit:"weeks", value : weeks};
	}

	var months = Math.round((weeks/4));
	if (months < 12) {
		return {unit:"months", value : months};
	}

	var years = Math.round((months/4));
	if (years < 12) {
		return {unit:"years", value : years};
	}
	
};

var display_args = function(destination, callback, data, filter_or_sort){
	$(destination).html('');

	if (filter_or_sort=="sort"){
		data.sort(callback);
	} 
	else if (filter_or_sort=="filter"){
		data.filter(callback);
	}
	
	if (data.length>0) {
		data.some(function(argumentItem) {
			var $this = argumentItem;
			

			
			var elapsed = fun_elapsed(parseInt(argumentItem.ArgumentTimestamp));
			
	        $(destination).append(
		  		'<div class="card p-3 lazy" data-argumentUUID="' + argumentItem.Keyworduuid + '" data-argumentTimeStamp="' + argumentItem.ArgumentTimestamp + '">' +
				    '<div class="card-block">' +
				      '<h4 class="card-title">' + argumentItem.Keyword.Keyword + '</h4>' +
				      '<a href="https://twitter.com/share?hashtags=sellmethis&text=Sell me this : ' + argumentItem.Keyword.Keyword + '!&url=https://s3.eu-west-2.amazonaws.com/bootstrapsmt/index.html?q=' + argumentItem.Keyword.Keyword + '" class="btn btn-primary" data-size="large" data-text="Sell me this!" data-url="https://s3.eu-west-2.amazonaws.com/bootstrapsmt/index.html" data-hashtags="SellMeThis" data-show-count="false"><i class="fa fa-twitter"></i></a>' +
				      '<p class="card-text">' + argumentItem.Text + '</p>' +
				      '<p class="card-text"><small class="text-muted">Submitted '+ elapsed.value +' '+ elapsed.unit +' ago</small></p>' +
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
	} 
	else {
		$(destination).append('<div><h4 class="card-title">No results</h4></div>');
		
	}
};

$(document).ready(function(){
	$.ajax({
		type: 'GET',
		url: API_URL + '/keywords',
		success: function(data){

			//$('#word-proposition').html('');
			$('#latest-arguments').html('');
			$('#keywords-list').html('');
			$('#carousel-words').html('');
			

			/*data.forEach(function(keywordItem){
				$('#word-proposition').append("<p>" + keywordItem.Article + ' ' +keywordItem.Keyword + "</p>");
				return keywordItem;
			})*/

			/*Init header page*/
			//var keywordItem = data[Math.floor(Math.random()*data.length)];
			//$('#word-proposition').append("<p>" + keywordItem.Article + ' ' +keywordItem.Keyword + "</p>");
			//$('#keyword_id').val(keywordItem.UUID);
			//$('#keywordTimestamp').val(keywordItem.KeywordTimestamp);
			  

			var iterator = 0;
			data.sort(function(keyw1, keyw2){return keyw2.KeywordTimestamp-keyw1.KeywordTimestamp});

			data.some(function(keywordItem) {
				

				var active = iterator == 0 ? "active" : "";
				var disabled = iterator == 0 ? "" : "disabled";

				var inputs = '<input type="hidden" name="keyword_id" id="keyword_id" value="'+keywordItem.UUID+'" '+disabled+'/>' +
                    			'<input type="hidden" name="keywordTimestamp" id="keywordTimestamp" value="'+keywordItem.KeywordTimestamp+'" '+disabled+'/>';

				var carousel_elt = '<div class="carousel-item ' + active + ' text-center p-4">' +
										inputs +
                     					'<div class="intro-heading" id="word-proposition' + iterator + '">'+
                     						"<p>" + keywordItem.Article + ' ' +keywordItem.Keyword + "</p>" +
                     					'</div>' +
                					'</div>';
                $('#carousel-words').append(carousel_elt);

                iterator++;


				var $this = keywordItem;
				$('#keywords-list').append(
					'<div class="card p-3">' +
						    '<span><a href data-search="'+$this.Keyword+'">' + $this.Keyword + '</a></span>' +
						  '</div>' 

						   );
				$("#keywords-list a").click(function( event ) {
					event.preventDefault();
					$("#search-input").val($(this).data("search"));
					$('#searchresults').show();
					$('html, body').animate({
				        scrollTop: $("#searchresults").offset().top
				    }, 1000);
				    var q_term = $('#search-input').val();
				    var result_args = all_arguments.filter(function(argumentItem){
				    	return argumentItem.Keyword.Keyword.toLowerCase().startsWith(q_term.toLowerCase());
				    });

				    display_args('#search-latest-arguments',
								function(arg1, arg2){return arg2.ArgumentTimestamp-arg1.ArgumentTimestamp},
								result_args,
								"sort" );

				    display_args('#search-best-ratings',
								function(arg1, arg2){return arg2.Up-arg1.Up},
								result_args,
								"sort" );
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
				});
			    
			});

			
		}
	});
	$.ajax({
		type: 'GET',
		url: API_URL + '/arguments',
		success: function(data){
			all_arguments = data.Items;

			display_args('#latest-arguments',
						function(arg1, arg2){return arg2.ArgumentTimestamp-arg1.ArgumentTimestamp},
						all_arguments,
						"sort" );

			display_args('#best-ratings',
						function(arg1, arg2){return arg2.Up-arg1.Up},
						all_arguments,
						"sort" );


			


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
								"Keyword_id": $( "#carousel-words input#keyword_id:not(:disabled)" ).val(),
								"KeywordTimestamp":$( "#carousel-words input#keywordTimestamp:not(:disabled)" ).val()
							}),
		contentType:"application/json",

		success: function(data){
			location.reload();
		}
	});

	return false;
});

$('#carouselContent').bind('slid.bs.carousel', function (e) {
    $('#carousel-words input').prop('disabled', true);
	$('#carousel-words .active input').prop('disabled', false);
});

$('.carousel').carousel({
    interval: false
}); 

$('#search-input').on('input', function() {
	$('#searchresults').show();
	$('html, body').animate({
        scrollTop: $("#searchresults").offset().top
    }, 1000);
    var q_term = $('#search-input').val();
    var result_args = all_arguments.filter(function(argumentItem){
    	return argumentItem.Keyword.Keyword.toLowerCase().includes(q_term.toLowerCase());
    });

    display_args('#search-latest-arguments',
				function(arg1, arg2){return arg2.ArgumentTimestamp-arg1.ArgumentTimestamp},
				result_args,
				"sort" );

    display_args('#search-best-ratings',
				function(arg1, arg2){return arg2.Up-arg1.Up},
				result_args,
				"sort" );
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

});

$('#navbarResponsive form').on('submit', function(event){

	event.preventDefault();
});





