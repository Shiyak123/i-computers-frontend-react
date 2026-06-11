export default function ProductCard(props) {
    console.log(props)

    return (
        <div className="border w-56 h-80">
            <h1>{props.name}</h1>
            <img src={props.image} className="w-40 h-40" />
            <p>{props.price}</p>
        </div>
    )
} 