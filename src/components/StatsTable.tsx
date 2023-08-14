import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CategoryTypes } from "@/utils/topics";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import UpdateStudentModel from "./modals/UpdateStudentModel";

import { IUser } from "@/models/User";
import { Delete } from "@mui/icons-material";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

interface StatsTableProps {
  id: string;
  email: string;
  name: string;
  course: string;
  class: string;
}

interface statistics {
  Operations: {
    total: number;
    total_correct: number;
    total_wrong: number;
  };
  Selection: {
    total: number;
    total_correct: number;
    total_wrong: number;
  };
  Repetition: {
    total: number;
    total_correct: number;
    total_wrong: number;
  };
  Arrays: {
    total: number;
    total_correct: number;
    total_wrong: number;
  };
  Functions: {
    total: number;
    total_correct: number;
    total_wrong: number;
  };
}

const StatsTable = ({
  leaderboard,
  isLoadingLeaderboard,
  refetch,
  page,
  setPage,
  pageSize,
  setPageSize,
  rowCountState,
}: {
  leaderboard: (IUser & Required<{ _id: string }>)[];
  isLoadingLeaderboard: boolean;
  refetch: () => Promise<void>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  rowCountState: number;
}) => {
  const [openUpdateModel, setOpenUpdateModel] = React.useState(false);
  const [updateModelData, setUpdateModelData] = React.useState({
    id: "",
    email: "",
    name: "",
    course: "",
    className: "",
  });
  const { mutate: deleteUser } = api.user.deleteUser.useMutation();

  const rows = React.useMemo(() => {
    if (isLoadingLeaderboard) return [];
    return leaderboard?.map((item, index) => {
      return {
        id: item._id,
        email: item.email,
        name: item.name,
        course: item.course,
        class: item.class,
        score: item.score,
        totalQuestions: Object.keys(item.statistics).reduce(
          (acc, key) =>
            acc +
            (item.statistics as unknown as statistics)[key as CategoryTypes]
              .total,

          0
        ),
        totalCorrect: Object.keys(item.statistics).reduce(
          (acc, key) =>
            acc +
            (item.statistics as unknown as statistics)[key as CategoryTypes]
              .total_correct,

          0
        ),
        overallAccuracy:
          (
            Math.round(
              (Object.keys(item.statistics).reduce(
                (acc, key) =>
                  acc +
                  (item.statistics as unknown as statistics)[
                    key as CategoryTypes
                  ].total_correct,

                0
              ) /
                Object.keys(item.statistics).reduce(
                  (acc, key) =>
                    acc +
                    (item.statistics as unknown as statistics)[
                      key as CategoryTypes
                    ].total,

                  0
                )) *
                10000
            ) / 100 || 0
          ).toString() + " %",
      };
    });
  }, [leaderboard, isLoadingLeaderboard]);

  const columns: GridColDef[] = [
    {
      field: "delete",
      headerName: "Delete",
      width: 70,
      renderCell: (params) => {
        const onClick = () => {
          const data = params.row as StatsTableProps;
          const id = (params.row as StatsTableProps).id;
          const confirm = window.confirm(
            `Are you sure you want to delete ${data.name}?`
          );
          if (!confirm) return;
          deleteUser(
            { user_id: id },
            {
              onSuccess: () => {
                refetch().catch(console.error);
                toast.success("User deleted successfully");
              },
              onError: (error) => {
                console.error(error);
                toast.error(error.message);
              },
            }
          );
        };

        return (
          <IconButton aria-label="delete" onClick={onClick}>
            <Delete color="error" />
          </IconButton>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 30,
      renderCell: (params) => {
        const onClick = () => {
          const data = params.row as StatsTableProps;
          setUpdateModelData({
            id: data.id,
            email: data.email,
            name: data.name,
            course: data.course,
            className: data.class,
          });
          const id = (params.row as StatsTableProps).id;

          // updateDB({
          //   id: id,
          //   data: {},
          // });
          setOpenUpdateModel(true);
          // console.log("done");
        };

        return (
          <IconButton aria-label="delete" onClick={onClick}>
            <EditIcon />
          </IconButton>
        );
      },
    },
    { field: "id", headerName: "ID", width: 150, editable: false },
    {
      field: "email",
      headerName: "Email",
      width: 270,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      editable: false,
    },
    {
      field: "course",
      headerName: "Course",
      width: 100,
      editable: false,
    },
    {
      field: "class",
      headerName: "Class",
      width: 100,
      editable: false,
    },
    {
      field: "score",
      headerName: "Score",
      type: "number",
      width: 110,
      editable: false,
      headerAlign: "left",
      align: "left",
    },

    {
      field: "totalQuestions",
      headerName: "Total Questions",
      type: "number",
      width: 100,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "totalCorrect",
      headerName: "Total Correct",
      type: "number",
      width: 120,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "overallAccuracy",
      headerName: "Overall Accuracy",
      type: "number",
      width: 160,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
  ];
  return (
    <Box sx={{ height: "70vh", paddingInline: 2 }}>
      <DataGrid
        rows={rows || []}
        rowCount={rowCountState}
        columns={columns}
        pagination
        page={page}
        onPageChange={(params) => {
          setPage(params);
        }}
        pageSize={pageSize}
        onPageSizeChange={(params) => setPageSize(params)}
        rowsPerPageOptions={[10, 20, 40, 80, 100]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        paginationMode="server"
        loading={isLoadingLeaderboard}
      />
      <UpdateStudentModel
        id={updateModelData.id}
        email={updateModelData.email}
        name={updateModelData.name}
        course={updateModelData.course}
        className={updateModelData.className}
        open={openUpdateModel}
        onClose={() => setOpenUpdateModel(false)}
        refetch={refetch}
      />
    </Box>
  );
};

export default StatsTable;
