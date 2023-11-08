
	function go(page){						//해당 페이지로 이동시키는 함수
		const limit = $('#viewcount').val();
		
		//const data = `limit=${limit}&state=ajax&page=${page}`; 와 같은 의미
		const data = {limit : limit, state : "ajax", page : page}
		
		ajax(data);							//ajax를 호출, 명칭은 마음대로 설정 가능
		
	}
	
	
	
	function setPaging(href, digit) {		//페이징 링크를 생성시키는 함수
		let active = "";
		let gray = "";
		
		if (href == "") {					//href가 빈 문자열일 경우
			if (isNaN(digit)){				//digit이 숫자가 아닌 경우
				gray = "gray";				//href가 빈 문자열일 경우 + digit이 숫자가 아닌 경우 = 버튼색을 회색으로 바꾼다
			}else {
				active = "active";			//href가 빈 문자열일 경우 + digit이 숫자인경우 = 버튼에 active를 준다
			}
		}//if end
		
		let output = `<li class="page-item ${active}">`;
		
		//let anchor = "<a class='page-link " + gray + "'" + href + ">" + digit + "</a></li>"; 와 같은 의미
		let anchor = `<a class="page-link ${gray}" ${href}>${digit}</a></li>`;
		
		output += anchor;
		return output;
	}
	

		
	
	function ajax(sdata) {
		console.log(sdata)
		let token = $("meta[name='_csrf']").attr("content");	
		let header = $("meta[name='_csrf_header']").attr("content");
		$.ajax({
			type : "post",
			data : sdata,
			url	 : "itdaNoticeList_ajax",
			dataType : "json",
			cache : false,
			beforeSend : function(xhr) {
				xhr.setRequestHeader(header, token);
			},
			success : function(data) {
				$("#viewcount").val(data.limit);
				$("thead").find("span").text("글 개수 : " + data.listcount);
				
				if (data.listcount > 0) {
					$("tbody").remove();
					let num = data.listcount - (data.page - 1) * data.limit;
					console.log(num)
					let output = "<tbody>";
					$(data.itdaNoticeList).each(
						function(index, item) {
							output += '<tr><td class="text-center">' + (num--) + '</td>'

							let adTitle = item.adTitle;
							if (adTitle.length >= 20) {
								adTitle = adTitle.substr(0, 20) + "...";		//0부터 20개 부분 문자열 추출
							
							}
							
							output += '<td class="text-center"><div>'
								   	+ ' <a href="itdaNotice/' + item.adNum + '">'
								   	+ adTitle.replace(/</g,'&lt;').replace(/>/g,'&gt;')
									+ '<td class="text-center"><div>' + item.adWriter + '</div></td>'
									+ '<td class="text-center"><div>' + item.adDate.substr(0,10) + '</div></td>'
									+ '<td class="text-center"><div>' + item.adView + '</div></td></tr>'
					})//each end
					output += "</tbody>"
					$('table').append(output);			//table 완성
					
					$(".pagination").empty();			//페이징 처리 영역 내용 제거
					output = "";
					
					let digit = '<i class="fa fa-chevron-left" aria-hidden="true"></i>'
					let href = "";
					
					if (data.page > 1) {											//이전 버튼의 링크 설정
						href = 'href=javascript:go(' + (data.page - 1) + ')';		//go function 실행
					}			//현재 페이지가 3인 상태에서 이전 버튼을 누르면 href=javascript:go(2)가 되는 것
					output += setPaging(href, digit);
					
					for (let i = data.startpage; i <= data.endpage; i++) {
						digit = i;
						href = "";
						
						if (i != data.page) {										//현재 페이지가 아닌 페이지 번호들
							href = 'href=javascript:go(' + i + ')';					//go function 실행
						}
						output += setPaging(href, digit);
						
					}//for end
					
					digit = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';
					href = "";
					
					if (data.page < data.maxpage) {									//다음 버튼의 링크 설정
						href = 'href=javascript:go(' + (data.page + 1) + ')';		//go function 실행
					}
					output += setPaging(href, digit);
					
					$('.pagination').append(output);
						 
				}
				
			},//success end
			
			error : function(){
				console.log('에러')
			}
			
		})//ajax end
		
	}//ready end
	
	
	
	$(function(){
		$("#itdaNoticeWbtn").click(function(){
			location.href="itdaNotice_Write";			//버튼 클릭시 write로 이동
		
		})// click end
		
		$("#viewcount").change(function(){
			go(1); 					// 보여줄 페이지를 1페이지로 설정한다
		
		})//change end
		
	});//ready end
	
	$(document).ready(function() {
		let selectedValue = $('input[name=search_field]').val();
		
		if (selectedValue == undefined) {
			selectedValue = 0;
		}else if (selectedValue != '-1') {
			$("#viewcount2").val(selectedValue);
		}
   		
		const $input = $("input[name=search_word]");			//$input을 모든 이벤트에서 사용
		const message = ["제목", "작성자", "날짜"]
	   	
		$input.attr("placeholder", message[selectedValue] + "을(를) 입력하세요");
	   	
		
		$('#viewcount2').change(function() {						//검색창에 placeholder를 나타나게 하는 이벤트
			selectedValue = $(this).val();
			$input.val('').attr("placeholder", message[selectedValue] + "을(를) 입력하세요");
	   	
		})//change end
	   	
	   	
		$("#search_but").on("click", function() {	//검색버튼 클릭시 이벤트
			if ($input.val() == "") {				//검색창에 아무것도 없는 경우
				alert("검색어를 입력하세요.");
				$input.focus();
				return false;
			}
		})//click end
		
	});