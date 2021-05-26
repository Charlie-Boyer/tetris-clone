import { v4 as uuidv4 } from 'uuid';
import './style.css';



function Piece({piece}) {



    return (
        <div className="piece-container">
            {piece?.map((cell, i) => (
          <div key={uuidv4()} className={`row ${cell}`}>
            {
              cell.split('').map((e) => e === '0' ? <div key={uuidv4()} className={`cell`}></div> : <div key={uuidv4()} className={`${e}-block`}></div>)
            }
          </div>
        ))}
        </div>
    )
}
export default Piece;