import '../App.css';
import '../css/ViewBoard.css';
import Logo from '../images/logo.jpg';
import getCookie from './GetCookie';
import {Link, useSearchParams, useNavigate} from 'react-router-dom';
import {useState, useEffect, useRef, useCallback} from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

const ViewBoard = () => {

    //날짜 기준을 한국으로 지정
    dayjs.locale('ko'); 
    
    //쿠키 설정
    const emailCookie = getCookie('email');
    const usernameCookie = getCookie('username');
 
    //게시판 상세 내용
    const [view, setView] = useState([]);
    const [email, setEmail] = useState('');
    const [writer, setWriter] = useState('');
    const [title, setTile] = useState('');
    const [regdate, setRegdate] = useState('');
    const [content, setContent] = useState('');
    const [replywriter, setReplywriter] = useState(usernameCookie);
    const [replycontent, setReplyContent] = useState('');
    const replyContentRef = useRef(); // ref를 이용해서 유효성 처리

    const [likeCnt,setLikeCnt] = useState(0);
    const [dislikeCnt,setDislikeCnt] = useState(0);    
    const myLikeCheckRef = useRef('');
    const myDislikeCheckRef = useRef('');
    const checkCnt = useRef('');
    const [likeStyle, setLikeStyle] = useState({});
    const [dislikeStyle, setDisLikeStyle] = useState({});
    const [myChoice, setMyChoice] = useState('');
    const [pre_seqno, setPre_seqno] = useState(0);
    const [next_seqno, setNext_seqno] = useState(0);
    const [fileView, setFileView] = useState([]);
    
    const [param] = useSearchParams();
    const seqno = param.get('seqno'); 
    const page = param.get('page');
    const keyword = param.get('keyword')===null?'':param.get('keyword');

    const [replyListView, setReplyListView] = useState('');

     useEffect(()=> {
        
        const fetchData = async() => {

            //게시물 상세 보기
            const view = await axios.get(`http://localhost:8080/restapi/view?seqno=${seqno}&email=${emailCookie}`);
            setView(view.data);
            setEmail(view.data.email);
            setWriter(view.data.writer);
            setTile(view.data.title);
            setRegdate(view.data.regdate);
            setContent(view.data.content);
            setLikeCnt(view.data.likecnt);
            setDislikeCnt(view.data.dislikecnt);
            //이전 보기
            const preseqno = await axios.get(`http://localhost:8080/restapi/preseqno?seqno=${seqno}&keyword=${keyword}`);
            setPre_seqno(preseqno.data.pre_seqno);
            //다음 보기
            const nextseqno = await axios.get(`http://localhost:8080/restapi/nextseqno?seqno=${seqno}&keyword=${keyword}`);
            setNext_seqno(nextseqno.data.next_seqno);
            //파일 목록 보기
            const fileView = await axios.get(`http://localhost:8080/restapi/fileView?seqno=${seqno}`);
            setFileView(fileView.data);

            const likeCheckView = await axios.get(`http://localhost:8080/restapi/likeCheckView?seqno=${seqno}&email=${emailCookie}`);
            myLikeCheckRef.current = likeCheckView.data.myLikeCheck;
            myDislikeCheckRef.current = likeCheckView.data.myDislikeCheck;
            if(myLikeCheckRef.current === undefined || myLikeCheckRef.current === '')
                myLikeCheckRef.current = "N";
            if(myDislikeCheckRef.current === undefined || myDislikeCheckRef.current === '')
                myDislikeCheckRef.current = "N";    
         
            if(myLikeCheckRef.current === "Y") setLikeStyle({backgroundColor:'#00B9FF'});
            if(myDislikeCheckRef.current === "Y") setDisLikeStyle({backgroundColor:'#00B9FF'});
        
            if(myLikeCheckRef.current === "Y")  setMyChoice(usernameCookie + '님의 선택은 좋아요입니다.');
            if(myDislikeCheckRef.current === "Y") setMyChoice(usernameCookie + '님의 선택은 싫어요입니다.');
            if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "N") setMyChoice(usernameCookie + '님은 아직 선택을 안 했네요');

        }

        fetchData();
        replyStartPage();
    
    },[page,seqno,keyword]);

    const likeView = () => {
        if(myLikeCheckRef.current === "Y" && myDislikeCheckRef.current === "N") {
	        alert("좋아요를 취소합니다."); 
	        checkCnt.current = '1';  //likeCnt --> 6개의 조건 중 1번 조건
            myLikeCheckRef.current = "N";
	        sendDataToServer(); 
            setLikeStyle({backgroundColor: '#d2d2d2'});
        }else if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "Y") {
	        alert("싫어요가 취소되고 좋아요가 등록됩니다.");
	        checkCnt.current = '2'; // likeCnt ++ , dislikeCnt --
	        myLikeCheckRef.current = "Y";
            myDislikeCheckRef.current = "N";
	        sendDataToServer();  
	        setLikeStyle({backgroundColor: '#00B9FF'});
            setDisLikeStyle({backgroundColor: '#d2d2d2'});
        } else if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "N") {
	        alert("좋아요를 선택 했습니다.")
	    	checkCnt.current = '3'; //likeCnt ++
            myLikeCheckRef.current = "Y";
            sendDataToServer();
            setLikeStyle({backgroundColor: '#00B9FF'});
        }
	    if(myLikeCheckRef.current === "Y") setMyChoice(`${usernameCookie}님의 선택은 좋아요입니다.`);
	    if(myDislikeCheckRef.current === "Y") setMyChoice(`${usernameCookie}님의 선택은 싫어요입니다.`);
	    if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "N") setMyChoice(`${usernameCookie}님은 아직 선택을 안 했네요`);
    }

    const disLikeView = () => {
        if(myDislikeCheckRef.current === "Y" && myLikeCheckRef.current === "N") {
	        alert("싫어요를 취소합니다."); 
	        checkCnt.current = '4'; // dislikeCnt --
            myDislikeCheckRef.current = "N";
	        sendDataToServer();
            setDisLikeStyle({backgroundColor: '#d2d2d2'});
        } else if(myDislikeCheckRef.current === "N" && myLikeCheckRef.current === "Y") {
	        alert("좋아요가 취소되고 싫어요가 등록됩니다.");
	        checkCnt.current = '5'; //likeCnt -- , dislikeCnt ++            
	        myLikeCheckRef.current = "N";
            myDislikeCheckRef.current = "Y";
	        sendDataToServer();
	        setLikeStyle({backgroundColor: '#d2d2d2'});
            setDisLikeStyle({backgroundColor: '#00B9FF'});
	    } else if(myDislikeCheckRef.current === "N" && myLikeCheckRef.current === "N") {
	        alert("싫어요를 선택했습니다.");
	    	checkCnt.current = '6'; //dislikeCnt ++
            myDislikeCheckRef.current = "Y";
	        sendDataToServer();
	        setDisLikeStyle({backgroundColor: '#00B9FF'});
	    }
	    if(myLikeCheckRef.current === "Y") setMyChoice(`${usernameCookie}님의 선택은 좋아요입니다.`);
	    if(myDislikeCheckRef.current === "Y") setMyChoice(`${usernameCookie}님의 선택은 싫어요입니다.`);
	    if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "N") setMyChoice(`${usernameCookie}님은 아직 선택을 안 했네요`);
    }

    const sendDataToServer = async () => {
	
        let formData = new FormData();
        formData.append("seqno", seqno);
        formData.append("email", emailCookie);
        formData.append("myLikecheck", myLikeCheckRef.current);
        formData.append("myDislikecheck", myDislikeCheckRef.current);
        formData.append("checkCnt", checkCnt.current);

        await fetch('http://localhost:8080/restapi/likeCheck', {
			
			method: 'POST',
			body: formData		
		}).then((response) => response.json())
		  .then((data)=> {			  
              setLikeCnt(data.likeCnt);
              setDislikeCnt(data.dislikeCnt);
       }).catch((error)=> {
    	   console.log("error = " + error);
       });	
		
	}

    // 렌더링 시 댓글 목록 가져오기
    const replyStartPage = async () => {
		let formData = new FormData();
		formData.append("seqno", seqno);
		
		await fetch('http://localhost:8080/restapi/reply?option=L', {
			method: 'POST',
			//headers: {"content-type":"application/json"},
			body: formData	
		}).then((response) => response.json())
		  .then((data) => replyList(data))
		  .catch((error)=> {
			  console.log("error = " + error);
			  alert("시스템 장애로 댓글 등록이 실패했습니다.");
		});
	}

    // REST API 서버에서 가져온 댓글 목록(JSON)을 웹 페이지에서 볼 수 있도록 변환
    const replyList = (data) => {
		
    	const jsonInfo = data;		
		
		var result = "";
		for(const i in jsonInfo){
			
			result += "<div id='replyListView'>";
            result += "  <div id = '" + jsonInfo[i].replyseqno + "' style='font-size: 0.8em'>";
            result += "    작성자 : " + jsonInfo[i].replywriter;

            result +=  jsonInfo[i].replyregdate
            result += "     <div style='width:90%; height: auto; border-top: 1px solid gray; overflow: auto;'>";
            result += "        <pre class='" + jsonInfo[i].replyseqno + "'>" + jsonInfo[i].replycontent + "</pre>";
            result += "     </div>";
            result += "  </div>";
            result += "</div><br>";
			
		}

        setReplyListView(result);
	}

    const replyRegister = async () => {
        // 유효성 처리
        if(replyContentRef.current.value === '' || replyContentRef.current.value === undefined)
            {alert("댓글을 입력하세요."); replyContentRef.current.focus(); return false;}
        
        let formData = new FormData();
        formData.append("seqno", seqno); 
        formData.append("email", emailCookie);
        formData.append("replywriter", replywriter);
        formData.append("replycontent", replycontent);
        
        await fetch('http://localhost:8080/restapi/reply?option=I', {
            method: 'POST',
            //headers: {"content-type":"application/json"},
            body: formData		
        }).then((response) => response.json())
            .then((data) => replyList(data))
            .catch((error)=> {
                console.log("error = " + error);
                alert("시스템 장애로 댓글 등록이 실패했습니다.");
        });
        
        setReplyContent('');
    
    }

    const replyCancel = () => {
        if(window.confirm("정말로 취소 하시겠습니까?") === true) { 
			replyContentRef.current.value = ''; 
			replyContentRef.current.focus(); 
		}

    }

    //파일 다운로드
    const fileDownload = (fileseqno) => {
        document.location.href='http://localhost:8080/restapi/filedownload?fileseqno=' + fileseqno;
    };

    //게시물 삭제
    const deleteBoard = () => {

        const seqno = param.get('seqno');
    
        if(window.confirm("정말로 삭제 하시겠습니까?") === true){
            fetch(`http://localhost:8080/restapi/delete?seqno=${seqno}`, {			
                method: 'GET'        
            }).then((response) => response.json())
                .then((data) => {
                    if(data.message === 'good')
                        document.location.href='/board/list?page=1';
                }).catch((error)=> {
                console.log("error = " + error);
            });	
        }
    };

    return(
        <div>
            <div>
		        <img id="topBanner" src={Logo} alt="서울기술교육센터" />	
	        </div>
	
            <div className="main">
                <h1>게시물 내용 보기</h1>
                <br />
                <div className="boardView">
                    <div className="field">이름 : {writer}</div>
                    <div className="field">제목 : {title}</div>
                    <div className="field">날짜 : {dayjs(regdate).format('YYYY-MM-DD HH:mm:ss')}</div>
                    <div className="content"><pre>{content}</pre></div>
                    <div className="likeForm" style={{width:'30%',height:'auto',margin:'auto',cursor:'pointer'}}>
                        <span>{likeCnt === undefined? '0': likeCnt}</span>&nbsp; {/* 좋아요 갯수 */}
                        <span onClick={likeView} className="likeClick" style={likeStyle}>좋아요</span> {/* 클릭하면 좋아요 등록/취소 */}
                        <span onClick={disLikeView} className="dislikeClick" style={dislikeStyle}>싫어요</span>&nbsp;{/* 클릭하면 싫어요 등록/취소 */}
                        <span>{dislikeCnt === undefined? '0': dislikeCnt}</span><br /> {/* 싫어요 갯수 */}
                        <span style={{textAlign:'center',color:'red'}}>{myChoice}</span> {/* 접속자의 선택을 표시 */}
                    </div>
                    {
                        fileView !== ''  ? 
                        fileView.map( (f)=>(
                        <div className="field" key={f.fileseqno}>파일명 : {f.org_filename} ({f.filesize}) Bytes <input type="button" value="다운로드" onClick={()=> {fileDownload(`${f.fileseqno}`)}}/></div>
                        )) : <div className="field">업로드된 파일이 없습니다.</div>
                    }
                    <br />
                     <br/><br/>
                </div>
                <br/>
                <div className="bottom_menu">
                    {
                        pre_seqno !== '0' && <Link to ={`/board/view?seqno=${pre_seqno}&page=${page}&keyword=${keyword}`}>이전글▼</Link>
                    }
                    &nbsp;&nbsp;
                    <Link to={`/board/list?page=${page}&keyword=${keyword}`}>목록보기</Link>
                    &nbsp;&nbsp;                    
                    {
                        next_seqno !== '0' && <Link to={`/board/view?seqno=${next_seqno}&page=${page}&keyword=${keyword}`}>다음글▲</Link>
                    }
                    &nbsp;&nbsp; 
                    <a href="/board/write">글 작성</a>
                    &nbsp;&nbsp; 
                    {
                        emailCookie ===  email.email && 
                        <Link to={`/board/modify?seqno=${seqno}&page=${page}&keyword=${keyword}`}>글 수정</Link>
                    } 
                    &nbsp;&nbsp;   
                    {
                        emailCookie === email.email && 
                        <a href='javascript:void(0)' onClick={deleteBoard}>글 삭제</a> 
                    }
                    
                </div>	
                <br/>
                <div className="replyDiv" style={{width:'60%',height:'300px',margin:'auto',textAlign:'left'}}>
                    <p id="replyNotice">댓글을 작성해 주세요</p>
                    <form id="replyForm" name="replyForm" method="POST"> 
                        작성자 : <input type="text"  value={replywriter} readOnly /><br />
                        <textarea ref={replyContentRef} value={replycontent} onChange={(e) => setReplyContent(e.target.value)} 
                            cols='80' rows='5' maxLength='150' placeholder='글자수:150자 이내'></textarea><br />
                    </form>
                    <input type="button" id="btn_reply" value="댓글등록" onClick={replyRegister} />
                    <input type="button" id="btn_cancel" value="취소" onClick={replyCancel} />
                    <hr/>                    
                    <div dangerouslySetInnerHTML={{ __html: replyListView }} style={{width:'100%',height:'600px',overflow:'auto'}}></div>		
                </div>
            </div>
        </div>
    )

}

export default ViewBoard;