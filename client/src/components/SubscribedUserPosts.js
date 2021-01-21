import React, {useState, useEffect, useContext} from "react";
import { userContext } from "../App";
import {Link} from 'react-router-dom'



function SubscribedUserPosts() {

  const [data, setData]=useState([])
  const {state, dispatch}=useContext(userContext)

  useEffect(()=>{
    fetch('/getsubpost', {
      headers:{
        'Authorization': "Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      //console.log(result)
      setData(result.posts)
    })
  }, []) //controversial use effect stuff


  const likePost = (id)=>{
    fetch('/like',{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res=>res.json())
    .then(result=>{
      const newData=data.map(item=>{
        if(item._id==result._id)return result
        else return item
      })
      setData(newData)
    }).catch(err=>console.log(err))
  }

  const unlikePost = (id)=>{
    fetch('/unlike',{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res=>res.json())
    .then(result=>{
      const newData=data.map(item=>{
        if(item._id==result._id)return result
        else return item
      })
      setData(newData)
    }).catch(err=>console.log(err))
  }


  // 💬💬💬💬 updating comments👇👇👇👇
  
  const makeComment = (text,postedBy)=>{
    fetch('/comment',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postedBy,
            text
        })
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newData = data.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
       })
      
      setData(newData)
      
      
    }).catch(err=>{
        console.log(err)
    })
}
// 🔴🔴🔴delete post handler🥵🥵🥵

const deletePost=(postid)=>{
  fetch(`/deletepost/${postid}`,{
    method:"delete",
    headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    }
}).then(res=>res.json())
.then(result=>{
  console.log(result)
  const newData=data.filter(item=>{
    return item._id !== result._id
  })
  console.log(newData)
  setData(newData)
  console.log(data)
})
.catch(err=>console.log(err))
}
  

  return (
    <div className="home">
    {
      data.map(item=>{
        return (
          <div className="card home-card" key={item._id}>
          <h5>
          <Link to={item.postedBy._id !== JSON.parse(state)._id?`/profile/${item.postedBy._id}`: `/profile`}> {item.postedBy.name}</Link>
         
          {state && item.postedBy._id == JSON.parse(state)._id &&
            <i className="material-icons" 
            style={{float: 'right'}} 
            onClick={()=>deletePost(item._id)}>delete</i>
          }
         
          </h5>


          <div className="card-image">
            <img
              src={item.pic}
              alt=""
            />
          </div>

          <div className="card-content">
          <i className="material-icons">favorite_border</i>
         
         
          {(state &&
           (item.likes.includes(JSON.parse(state)._id))?
            <i className="material-icons" onClick={()=>unlikePost(item._id)}>thumb_down</i>
            :
          <i className="material-icons" onClick={()=>likePost(item._id)}>thumb_up</i>
          )}

          <h6>{item.likes.length+' likes'}</h6>
            <h6>{item.title}</h6>
            <p>{item.body}</p>

            {
              item.comments.map(record=>{
                return(
                  <h6 key={record._id}>
                  <span><strong>{record.postedBy.name}</strong></span>
                  {record.text}
                  </h6>
                )
              })
            }


            <form onSubmit={e=>{
              e.preventDefault();
              makeComment(e.target[0].value, item._id)
            }}>
            <input type="text" placeholder="comment" />
            </form>
            
          </div>
        </div>
        )
      })
    }
      
    </div>
  );
}

export default SubscribedUserPosts;
