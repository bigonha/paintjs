$(function(){
	
	$('#export_xml').submit(function(){
		$.ajax({
			url: $(this).attr('action'),
			dataType: 'html',
			type: 'post',
			data: {figura: window.data},
			
		}).done(function(data){
			
			$('#export_xml').append('<p>'+data+'</a>');
		});
		return false;
	});
	

	

});

