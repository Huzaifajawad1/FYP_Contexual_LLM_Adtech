import './App.css';
import  axios  from 'axios';
import gptlogo from './assets/iparhailogo.svg';
import addBtn from './assets/add-30.png';
import mssgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/faviconm.png';
import { useEffect, useRef, useState } from 'react';
import { sendMsgToModel } from './model';
import RatingReview from './StarRating';
import { Rating } from 'react-simple-star-rating';
function App() {
  const msgEnd = useRef(null);
  const [idInput, setIdInput] = useState("")
  const [rating,setRating] = useState(0); 
  const [input,setInput] = useState("");
  const [messages,setMessages] = useState([{
    text: "Hi , I am your study assistant iParhai",
    isBot: true,
    rating:0,

  }]);
  
  useEffect(()=>{
    msgEnd.current.scrollIntoView();
  }
  ,[messages])
const handleSend = async () => {
   const text = input;
   setInput('');
   setMessages([
    ...messages,
    {
      text,
      isBot:false
    }
   ])
    const res = await sendMsgToModel(text)
      setMessages([
        ...messages,
        { text, isBot: false},
        { text: res, isBot: true, rating:0} 
      ]);
}

 const handleEnter = async (e) => {
  if(e.key==='Enter') await handleSend();
 }
 
  const handleQuery = async (e) => {
    const text = e.target.value; 
    setMessages([
     ...messages,
     {
       text,
       isBot:false
     }
    ])
     const res = await sendMsgToModel(text)
       setMessages([
         ...messages,
         { text, isBot: false},
         { text: res, isBot: true} 
       ]);
  }


  const handleRatingChange = async (rating, index) => {
    console.log(rating);
    const updatedMessages = messages.map((message, i) => {
      if (i === index) {
        return { ...message, rating: rating };
      }
      return message;
    });
    setMessages(updatedMessages);
  
    // Check if bot response and user's previous input exist
    if (index > 0 && updatedMessages[index].isBot) {
      const userMessage = updatedMessages[index - 1];
      const botResponse = updatedMessages[index];
      await savetomongo(userMessage.text, botResponse.text, rating);
    }
  };
  
  const savetomongo = async (prompt, response, rating) => {
  console.log(prompt+ response + rating);
    try {
      await axios.post('http://localhost:3000/save', { prompt, response, rating });
      console.log("Data sent successfully");
    } catch (error) {
      console.error("Failed to send data:", error);
    }
  
  };


  const handleIdInputChange = (e) => {
    setIdInput(e.target.value);
  };
  
  const handleSetId = () => {
    sessionStorage.setItem('userID', idInput); // Set the ID in session storage
  };



  return (
    
    <div className="App">
      <div className="sideBar">
        <div className="upperSide">
            <div className='upperSideTop'><img src={gptlogo} alt='logo' className='logo' /></div>
             <button className="midBtn" onClick={() => window.location.reload()}><img src={addBtn} alt="new chat" className="addBtn" />New Chat</button>
             <div >
             <input type="text" className='logo' style={{marginLeft: '6.5rem'}} placeholder='Enter ID' value={idInput} onChange={handleIdInputChange} /><br/>
             <button className="midBtn" onClick={handleSetId}>Set ID</button>
             </div>
                <div className="upperSideBottom">
                  <button className="query" ><img src={mssgIcon} alt="query" />What is Programming? </button>
                  <button className="query" ><img src={mssgIcon} alt="query" />how to use API?</button>
                </div>
        </div> 
           
        <div className='lowerSide'>
             <div className="listItems"><img src={home} alt="home" className="listItemsImg" />Home</div>
             <div className="listItems"><img src={saved} alt="saved" className="listItemsImg" />Saved</div>
             <div className="listItems"><img src={rocket} alt="rocket" className="listItemsImg" />Upgrade to Pro</div>
       </div>
      </div>
      <div className="main">

         <div className="chats">
         {messages.map((message,i) => {
          console.log("Original message:", message.text);
          console.log("Split result:", message.text.split('\\n'));
          
          return (
            <div key={i} className={message.isBot ? "chat bot" : "chat"}>
              <img className='chatimage' src={message.isBot ? gptImgLogo : userIcon} alt="" />
              {message.text.split('\\n').map((subMessage, subIndex) => (
                <p key={subIndex} className="txt">{subMessage}</p>
                
              ))}
               {message.isBot && (
          <div className="rateplaceholder">
            How useful was the response, please rate :
            {/* <RatingReview rating={rating} setRating={setRating} /> */}
            <Rating
                    ratingValue={message.rating} // Assuming Rating component accepts ratingValue prop
                    onClick={(rate) => handleRatingChange(rate, i)}
                  />
          </div>
        )}
            </div>
          );
        })}
            <div ref={msgEnd}/>
         </div>
         <div className="chatFooter">
           <div className="inp">
           <input type="text" placeholder='Send a Prompt' value={input} onKeyDown={handleEnter} onChange={(e) =>{setInput(e.target.value)}}/><button className="send" onClick={handleSend}><img src={sendBtn} alt="send Button" /></button>
           </div>
           <p>Prototype for Contextual LLM FYP. Testing phase, 1st Version.</p>
         </div>

      </div>
    
    </div>
  );
}

export default App;
