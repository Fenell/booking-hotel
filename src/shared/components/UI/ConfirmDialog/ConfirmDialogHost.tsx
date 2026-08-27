import { useSyncExternalStore } from "react";
import { AnimatePresence } from "motion/react";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "../Modal";
import Button from "../Button/Button";
import {
  answerConfirm,
  getConfirmSnapshot,
  subscribeConfirm,
} from "./confirmStore";
import dialogStyle from "./ConfirmDialog.module.css";

/**
 * Điểm hiển thị duy nhất của các hộp thoại xác nhận. Đặt trong `AppProvider`
 * nên hộp thoại nằm trong cây React chính và dùng được mọi context của app.
 */
const ConfirmDialogHost = () => {
  const request = useSyncExternalStore(subscribeConfirm, getConfirmSnapshot);

  // mode="wait": hộp thoại cũ biến mất hẳn rồi mới tới lượt hộp kế tiếp
  return (
    <AnimatePresence mode="wait">
      {request && (
        <Modal
          key={request.id}
          size="sm"
          closeOnEscape
          onClose={() => answerConfirm(request.id, false)}
        >
          <ModalHeader title={request.title} hasCloseButton={false} />
          <ModalContent>
            <p className={dialogStyle.text}>{request.text}</p>
          </ModalContent>
          <ModalFooter>
            <Button
              onClick={() => answerConfirm(request.id, true)}
              noAnimation
              small
              icon="fa-regular fa-check fa-lg"
              status={request.danger ? "error" : "success"}
            >
              {request.options?.trueButtonText ?? "Đồng ý"}
            </Button>
            <Button
              onClick={() => answerConfirm(request.id, false)}
              noAnimation
              small
              icon="fa-regular fa-ban fa-lg"
              status="dark"
            >
              {request.options?.falseButtonText ?? "Bỏ qua"}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialogHost;
