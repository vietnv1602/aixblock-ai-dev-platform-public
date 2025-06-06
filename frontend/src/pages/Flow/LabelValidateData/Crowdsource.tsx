import LabelAndValidateDataLayout from "./LabelAndValidateDataLayout";
import {useNavigate} from "react-router-dom";
import {useFlowProvider} from "../FlowProvider";
import {default as BaseCrowdsource} from "../Shared/Crowdsource";
import {useOnDataPreparationNext} from "./hooks";

export default function Crowdsource() {
  const {project} = useFlowProvider();
  const navigate = useNavigate();
  const onNext = useOnDataPreparationNext();

  return (
    <LabelAndValidateDataLayout
      onBack={() => navigate("/label-and-validate-data/" + project?.id + "/setup-infrastructure/storage")}
      onNext={onNext}
    >
      <BaseCrowdsource />
    </LabelAndValidateDataLayout>
  );
}
