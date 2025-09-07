import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks";
import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { SplitButton } from "primereact/splitbutton";
import { PhotoUploadModal } from "../modals";
import { AlbumCreateModal } from "../modals/AlbumCreateModal";

export function AuthLayout() {
  const { query } = useAuth();
  const nav = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState<
    "photo" | "album" | null
  >(null);

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
        visible={isModalVisible === "photo"}
        onHide={() => setIsModalVisible(null)}
      />

      <AlbumCreateModal
        visible={isModalVisible === "album"}
        onHide={() => setIsModalVisible(null)}
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
            onClick={() => setIsModalVisible("photo")}
            model={[
              {
                label: "Album",
                icon: "pi pi-plus",
                command: () => setIsModalVisible("album"),
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
