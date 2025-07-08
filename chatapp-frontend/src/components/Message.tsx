import React from 'react'

interface MessageProps {
    sender: string;
    content: string;
    isOwnMessage: boolean;
    timestamp: string;
    type: string;
}

const Message: React.FC<MessageProps> = ({ sender, content, isOwnMessage, timestamp, type }) => {

    // // Format giờ phút
    // const formattedTime = new Date

    // console.log(formattedTime);
    

    return (    
        <div className={`flex ${ isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
            <div 
                className={`shadow-md flex flex-col max-w-[70%] p-3 rounded-2xl ${isOwnMessage ? "bg-blue-500 text-white rounded-br-sm" : "bg-gray-200 text-gray-900 rounded-bl-sm"}`}
            >
                {!isOwnMessage && (
                    <span className='text-sm font-semibold text-gray-600 mb-1'>
                        {sender}
                    </span>
                )}

                { type === "IMAGE" ? (
                    <img src={content} alt="sent-img" className="max-w-xs rounded-md"/>
                    ) : <p className='text-base leading-relaxed'> {content} </p> 
                }
                <span className={`text-xs mt-1 ${isOwnMessage ? "text-white/70" : "text-gray-600/70"}`}>
                    {timestamp}
                </span>
            </div>
        </div>
    );
}

export default Message;