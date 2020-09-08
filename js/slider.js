jQuery(document).ready(function($){

	var sliderInit = function () {

		// Counts number of decimals in current
		var countDecimals = function (value) {
		    if(Math.floor(value) === value) return 0;
		    return value.toString().split(".")[1].length || 0;
		}

		var renderSlider = function () {

			// Do this for each slider div
			$('.slider-display').each(function(i,GFSlider) {

				if ( ! $(this).hasClass('slider-initialized') ) {

					// Retrieve variables from DOM
					var slider = $(this);
					var input = slider.prev(':input');
					var value = input.val();
					var gfield = input.attr('id');
					var tabindex = input.attr('tabindex');
					var minrel = input.data('min-relation');
					var maxrel = input.data('max-relation');
					var min = parseFloat(input.attr('min'));
					var max = parseFloat(input.attr('max'));
					var step = parseFloat(input.attr('step'));
					var labels = (input.attr('labels')).split("|")
					var visibility = input.data('value-visibility');
                    var connect = input.data('connect');
					var format = input.data('value-format');

					// Check whether step needs to be limited by the decimals available in the currency
					if ( 'currency' == format ) {
						var currency = input.data('currency');
						if ( currency['decimals'] < countDecimals(step) ) {
							if ( currency['decimals'] == 0 ) {
								var step = 1;
							} else if ( currency['decimals'] == 1 ) {
								var step = 0.1;
							} else if ( currency['decimals'] == 2 ) {
								var step = 0.01;
							}
						}
						var decs = currency['decimals'];
					} else {
						var decs = countDecimals(step);
					}

					// Determine handle value visibility and link to handle value
					if ( 'hover-drag' == visibility || 'show' == visibility ) {

						if ( 'currency' == format ) {
							var currency = input.data('currency');
							var formatTooltip = wNumb({
								decimals: currency['decimals'],
								mark: currency['decimal_separator'],
								thousand: currency['thousand_separator'],
								prefix: currency['symbol_left'] + currency['symbol_padding'],
								postfix: currency['symbol_padding'] + currency['symbol_right'],
							});
						} else if ( 'decimal_comma' == format ) {
							var formatTooltip = wNumb({
								decimals: countDecimals( step ),
								mark: ',',
								thousand: '.',
							});
						} else {
							var formatTooltip = wNumb({
								decimals: countDecimals( step ),
							});
						}

					} else {
						formatTooltip = false;
					}

					noUiSlider.create(GFSlider, {
						start: [ value ],
						step: step,
						range: {
							'min': [ min ],
							'max': [ max ]
						},
						pips: {
							mode: 'count',
							values: max+1-min,
							density: 100/(labels.length-1)
						},
						
						format: wNumb({
							decimals: decs,
						}),
                  connect: connect,
						tooltips:  {
							to: function(value) {
									// Math.round and -1, so 1.00 => 0, 2.00 => 2, etc.
									return labels[Math.round(value) ];
							},
							from: Number
						},
					});

					// Prevents re-initializing sliders on form pagination
					slider.addClass('slider-initialized');

					GFSlider.noUiSlider.on('update', function(sliderVal) {

						input.attr('value',sliderVal);

						// Triggers update of merge tags on mouseup and keyup
						$('.gfield .slider').trigger('change');

					});

					document.getElementById(gfield).addEventListener('change', function () {
					    GFSlider.noUiSlider.set(this.value);
					});

					// Add min and max relation note
					slider.append('<span class="min-val-relation">' + minrel + '</span><span class="max-val-relation">' + maxrel + '</span>' );
					var pipsSlider = slider[0];
					var pips = pipsSlider.querySelectorAll('.noUi-value');

					function clickOnPip() {
						var value = Number(this.getAttribute('data-value'));
						pipsSlider.noUiSlider.set(value);
					}

					for (var i = 0; i < pips.length; i++) {

						// For this example. Do this in CSS!
						pips[i].style.cursor = 'pointer';
						pips[i].addEventListener('click', clickOnPip);
					}
					
								
					$('.noUi-base',slider).each(function(){
						$(this).prepend($(this).find('.noUi-tooltip'));
					});
					
					$('.noUi-value.noUi-value-horizontal.noUi-value-large',slider).each(function(){
						var val = $(this).html();
						val = recountVal(parseInt(val),$(this).closest('.ginput_container').find('input').first());
						$(this).html(val);
					});
				}

			});
		}

		renderSlider();
			
	};

	function recountVal(val,input){
		var labels = (input.attr('labels')).split("|");
		return labels[val];
	}

	jQuery(document).bind('gform_page_loaded', function() {
		if ( $('.gfield .slider').length ) {
			sliderInit();
		}
	});

	sliderInit();
	
	
});
