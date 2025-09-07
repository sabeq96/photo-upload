import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks";
import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { SplitButton } from "primereact/splitbutton";
import { PhotoUploadModal } from "../modals";

export function AuthLayout() {
  const { query } = useAuth();
  const nav = useNavigate();

  const [isPhotoUploadModalVisible, setIsPhotoUploadModalVisible] =
    useState(false);

  useEffect(() => {
    if (!query.data) {
      nav("/login");
    }
  }, [query.data]);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PhotoUploadModal
        visible={isPhotoUploadModalVisible}
        onHide={() => setIsPhotoUploadModalVisible(false)}
      />

      <Card
        pt={{ content: { className: "flex items-center justify-between" } }}
      >
        <div className="text-xl">
          Hello {query.data?.name || query.data?.email}
        </div>
        <div>
          <SplitButton
            label="Photo"
            icon="pi pi-plus"
            onClick={() => setIsPhotoUploadModalVisible(true)}
            model={[
              {
                label: "Album",
                icon: "pi pi-plus",
                command: () => console.log("Album"),
              },
              {
                label: "Logout",
                icon: "pi pi-sign-out",
                command: () => console.log("Logout"),
              },
            ]}
          />
        </div>
      </Card>
      <Outlet />
    </div>
  );
}
