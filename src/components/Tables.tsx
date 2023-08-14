import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import type { IEvents } from "@/models/Events";
import EditEvents from "@/components/modals/EditEvents";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

interface TableProps {
  _id: string;
  eventname: string;
  description: string;
  startDate: string;
  endDate: string;
  multiplierType: string;
  multiplierValue: number;
  topic: string;
  status: string;
  actions: string;
}

const Tables = ({
  refetch,
  data,
}: {
  refetch: () => Promise<void>;
  data: (IEvents & Required<{ _id: string }>)[];
}) => {
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [updateModelData, setUpdateModelData] = React.useState<TableProps>({
    _id: "",
    eventname: "",
    description: "",
    startDate: "",
    endDate: "",
    multiplierType: "",
    multiplierValue: 0,
    topic: "Operations",
    status: "active",
    actions: "edit",
  });

  const rows = React.useMemo(
    () =>
      data.map((item, index) => ({
        no: index + 1,
        _id: item._id,
        eventname: item.eventname,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
        topic: item.topic,
        multiplierType: item.multiplier.type,
        multiplierValue: item.multiplier.value,
        status: item.status,
      })),
    [data]
  );

  const columns: GridColDef[] = [
    {
      field: "eventname",
      headerName: "Event Name",
      width: 180,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      editable: true,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 150,
      editable: true,
      renderCell: (params) => {
        return new Date(params.value as string).toLocaleDateString();
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 150,
      editable: true,
      renderCell: (params) => {
        return new Date(params.value as string).toLocaleDateString();
      },
    },
    {
      field: "topic",
      headerName: "Topic",
      type: "string",
      width: 110,
      editable: true,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "multiplierValue",
      headerName: "MultiplierValue ",
      type: "number",
      width: 120,
      editable: true,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "multiplierType",
      headerName: "MultiplierType ",
      type: "string",
      width: 120,
      editable: true,
      headerAlign: "left",
      align: "left",
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   type: "string",
    //   width: 100,
    //   editable: true,
    //   headerAlign: "left",
    //   align: "left",
    // },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => {
        const onClick = () => {
          const data = params.row as TableProps;
          setUpdateModelData(data);
          setEditModalOpen(true);
        };

        return (
          <IconButton aria-label="edit" onClick={onClick}>
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: "calc(100vh - 180px)", overflow: "auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[10, 20, 50]}
        getRowId={(row) => {
          const r = row as TableProps;
          return r._id;
        }}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      <EditEvents
        id={updateModelData._id}
        name={updateModelData.eventname}
        desc={updateModelData.description}
        startdate={new Date(updateModelData.startDate)}
        enddate={new Date(updateModelData.endDate)}
        multiplierType={updateModelData.multiplierType}
        multiplierValue={updateModelData.multiplierValue}
        status={updateModelData.status}
        actions={updateModelData.actions}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        refetch={refetch}
      />
    </Box>
  );
};

export default Tables;
