import { CallbackFunctionVariadic } from "../../../Util/Others";

export interface IFGameAreaProps {
  onClose?: CallbackFunctionVariadic;
  onBack?: CallbackFunctionVariadic;
}
export const GameArea = (props: IFGameAreaProps) => {
  return (
    <div>
      <div>
        <button
          onClick={() => {
            if (props.onBack) {
              props.onBack();
            }
          }}
        >
          Back to Game List
        </button>
      </div>
      Game view support two types of game loading on in external and other one
      is internal...
    </div>
  );
};
