import copyImg from '../assets/images/share.svg';
import '../styles/room-code.scss';

type RoomCodeProps = {
    name: string
    code: string
}

export function RoomCode(props: RoomCodeProps) {
    async function copyRoomCodeToCLipboard() {
        const shareData = {
            title: `Letmeask (Sala ${props.name})`,
            text: 'Entre para o letmeask e faça perguntas ao vivo!',
            url: `/rooms/${props.code}`,
        }

        await navigator.share(shareData);
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToCLipboard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala {props.code}</span>
        </button>
    )
}