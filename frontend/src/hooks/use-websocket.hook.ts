import { socketService } from "@/services";

const useWebsocket = () => socketService.getInstance();

export { useWebsocket };
