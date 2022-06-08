import { TreeviewItem } from "ngx-treeview";
import { AssetCategoryMasterService } from "src/app/core/service/assetcategorymaster.service";
import { AssetSubCategoryMasterService } from "src/app/core/service/assetsubcategorymaster.service";
import { BrandmasterService } from "src/app/core/service/brandmaster.service";
import { BrandmodelmasterService } from "src/app/core/service/brandmodelmaster.service";
import { BuildingmasterService } from "src/app/core/service/buildingmaster.service";
import { CommonValueListService } from "src/app/core/service/commonlistvalue.service";
import { DepartmentmasterService } from "src/app/core/service/departmentmaster.service";
import { EmployeeMasterService } from "src/app/core/service/employeemaster.service";
import { FloormasterService } from "src/app/core/service/floormaster.service";
import { LocationmasterService } from "src/app/core/service/locationmaster.service";
import { ProductMasterService } from "src/app/core/service/productmaster.service";
import { RoommasterService } from "src/app/core/service/roommaster.service";
import { SitemasterService } from "src/app/core/service/sitemaster.service";
import { AssetCategoryMasterModel } from "../model/AssetCategoryMasterModel";
import { AssetSubCategoryMasterModel } from "../model/AssetSubCategoryMasterModel";
import { BrandMasterModel } from "../model/BrandMasterModel";
import { BrandModelMasterModel } from "../model/BrandModelMasterModel";
import { BuildingMasterModel } from "../model/BuildingMasterModel";
import { CommonValueListModel } from "../model/CommonValueListModel";
import { DepartmentMasterModel } from "../model/DepartmentMasterModel";
import { EmployeeMasterModel } from "../model/EmployeeMasterModel";
import { FloorMasterModel } from "../model/FloorMasterModel";
import { LocationMasterModel } from "../model/LocationMasterModel";
import { ProductMasterModel } from "../model/ProductMasterModel";
import { RoomMasterModel } from "../model/RoomMasterModel";
import { SiteMasterModel } from "../model/sitemastermodel";

export class TreeViewBuilder {
  categoryCodes: AssetCategoryMasterModel[] = [];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  productCodes!: ProductMasterModel[];
  brandCodes: BrandMasterModel[] = [];
  modelCodes: BrandModelMasterModel[] = [];
  sitecodes: SiteMasterModel[] = [];
  buildingcodes: BuildingMasterModel[] = [];
  locationCodes!: LocationMasterModel[];
  floorCodes!: FloorMasterModel[];
  roomCodes!: RoomMasterModel[];
  commonValueListCodes!: CommonValueListModel[];
  departmentCodes!: DepartmentMasterModel[];
  employeeCodes!: EmployeeMasterModel[];
  constructor() {

  }

  async GetCategoryTreeviewItems(assetCategoryMasterService: AssetCategoryMasterService): Promise<TreeviewItem[]> {

    this.categoryCodes = await assetCategoryMasterService.getAssetCategoryMaster();

    return this.categoryCodes.map((item: any) => {
      return new TreeviewItem({ text: item.assetCategoryName, value: item.assetCategoryId, collapsed: false, checked: false });
    });

  }

  async GetSubCategoryTreeviewItems(assetSubCategoryService: AssetSubCategoryMasterService): Promise<TreeviewItem[]> {

    this.subCategoryCodes = await assetSubCategoryService.getAssetSubCategoryMaster();

    const generateChild = (arr: any) => {
      return arr.reduce((acc: any, val: any, ind: any, array: any) => {
        const children: TreeviewItem[] = [];
        array.forEach((el: any, i: any) => {
          if (el.assetCategoryId === val.assetCategoryId) {
            children.push(new TreeviewItem({ text: el.assetSubCategoryName, value: el.assetSubCategoryId, checked: false }));
          };
        });
        return acc.concat({ ...val, children });
      }, []);
    };
    let categoryTree = generateChild(this.subCategoryCodes);

    categoryTree = categoryTree.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.assetCategoryId === v.assetCategoryId)) === i);

    return categoryTree.map((item: any) => {
      return new TreeviewItem({ text: item.assetCategory.assetCategoryName, value: item.assetCategoryId, collapsed: false, children: item.children, checked: false });
    });


  }

  async GetProductTreeviewItems(productMasterService: ProductMasterService): Promise<TreeviewItem[]> {

    this.productCodes = await productMasterService.getProductMaster();

    const generateChild = (arr: any) => {
      return arr.reduce((acc: any, val: any, ind: any, array: any) => {
        const children: TreeviewItem[] = [];
        array.forEach((el: any, i: any) => {
          if (el.assetSubCategoryId === val.assetSubCategoryId) {
            children.push(new TreeviewItem({ text: el.productName, value: el.productId, checked: false }));
          };
        });
        return acc.concat({ ...val, children });
      }, []);
    };
    let categoryTree = generateChild(this.productCodes);

    categoryTree = categoryTree.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.assetSubCategoryId === v.assetSubCategoryId)) === i);

    return categoryTree.map((item: any) => {
      return new TreeviewItem({ text: item.assetSubCategoryName, value: item.assetSubCategoryId, collapsed: false, children: item.children, checked: false });
    });


  }

  async GetEmployeeTreeviewItems(employeeMasterService: EmployeeMasterService): Promise<TreeviewItem[]> {
    this.employeeCodes = await employeeMasterService.getEmployeeMaster();
    const generateChild = (arr: any) => {
      return arr.reduce((acc: any, val: any, ind: any, array: any) => {
        const children: TreeviewItem[] = [];
        array.forEach((el: any, i: any) => {
          if (el.departmentId === val.departmentId) {
            children.push(new TreeviewItem({ text: el.firstName, value: el.employeeId, checked: false }));
          };
        });
        return acc.concat({ ...val, children });
      }, []);
    };
    let categoryTree = generateChild(this.employeeCodes);
    categoryTree = categoryTree.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.departmentId === v.departmentId)) === i);
    return categoryTree.map((item: any) => {
      return new TreeviewItem({ text: item.departmentName, value: item.departmentId, collapsed: false, children: item.children, checked: false });
    });
  }
  async GetSiteTreeviewItems(sitemasterService: SitemasterService): Promise<TreeviewItem[]> {

    this.sitecodes = await sitemasterService.getSiteMaster();

    return this.sitecodes.map((item: any) => {
      return new TreeviewItem({ text: item.siteName, value: item.siteID, collapsed: false, checked: false });
    });

  }

  async GetBrandTreeviewItems(brandMasterService: BrandmasterService): Promise<TreeviewItem[]> {

    this.brandCodes = await brandMasterService.getBrandMaster();

    return this.brandCodes.map((item: any) => {
      return new TreeviewItem({ text: item.brandName, value: item.brandId, collapsed: false, checked: false });
    });
  }
  async GetDepartmentTreeviewItems(departmentmasterService: DepartmentmasterService): Promise<TreeviewItem[]> {
    this.departmentCodes = await departmentmasterService.getDepartmentMaster();
    return this.departmentCodes.map((item: any) => {
      return new TreeviewItem({ text: item.departmentName, value: item.departmentID, collapsed: false, checked: false });
    });
  }
  async GetAssetStatusTreeviewItems(commonValueListService: CommonValueListService): Promise<TreeviewItem[]> {
    this.commonValueListCodes = await commonValueListService.getAssetStatusItems();
    return this.commonValueListCodes.map((item: any) => {
      return new TreeviewItem({ text: item.displayText, value: item.value, collapsed: false, checked: false });
    });

  }

  async GetModelTreeviewItems(brandmodelmasterService: BrandmodelmasterService): Promise<TreeviewItem[]> {

    this.modelCodes = await brandmodelmasterService.getBrandmodelMaster();

    const generateChild = (arr: any) => {
      return arr.reduce((acc: any, val: any, ind: any, array: any) => {
        const children: TreeviewItem[] = [];
        array.forEach((el: any, i: any) => {
          if (el.brandID === val.brandID) {
            children.push(new TreeviewItem({ text: el.modelName, value: el.modelID, checked: false }));
          };
        });
        return acc.concat({ ...val, children });
      }, []);
    };
    let modelTree = generateChild(this.modelCodes);

    modelTree = modelTree.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.brandID === v.brandID)) === i);

    return modelTree.map((item: any) => {
      return new TreeviewItem({ text: item.brandName, value: item.brandID, collapsed: false, children: item.children, checked: false });
    });

  }

  async GetBuildingTreeviewItems(buildingmasterService: BuildingmasterService): Promise<TreeviewItem[]> {

    this.buildingcodes = await buildingmasterService.getBuildingMaster();

    const generateChild = (arr: any) => {
      return arr.reduce((acc: any, val: any, ind: any, array: any) => {
        const children: TreeviewItem[] = [];
        array.forEach((el: any, i: any) => {
          if (el.siteID === val.siteID) {
            children.push(new TreeviewItem({ text: el.buildingName, value: el.buildingID, checked: false }));
          };
        });
        return acc.concat({ ...val, children });
      }, []);
    };
    let buildingTree = generateChild(this.buildingcodes);

    buildingTree = buildingTree.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.siteID === v.siteID)) === i);

    return buildingTree.map((item: any) => {
      return new TreeviewItem({ text: item.siteName, value: item.siteID, collapsed: false, children: item.children, checked: false });
    });

  }

  async GetLocationTreeviewItems(locationMasterService: LocationmasterService): Promise<TreeviewItem[]> {
    this.locationCodes = await locationMasterService.getLocationMaster();
    const generateLocationChild = (arr: any) => {
      return arr.reduce((acc: any, val: any, ind: any, array: any) => {
        const roomArr: TreeviewItem[] = [];
        const buildingArr: TreeviewItem[] = [];
        const floorArr: TreeviewItem[] = [];
        const locationArr: TreeviewItem[] = [];
        const locationList: TreeviewItem[] = [];

        const roots: any = [];
        var found: boolean = false;
        array.forEach((el: any, i: any) => {
          let siteGroup: any;
          let buildingGroup!: any;
          let floorGroup: any;
          let roomGroup: any;
          let locationGroup: any;
          if (acc.some((item: any) => item.siteID === val.siteID)) {
            found = false;
            siteGroup = acc.filter((e: any) => e.siteID === el.siteID)[0];
            buildingGroup = siteGroup ? siteGroup.buildingArr.filter((c: any) => c.value === el.buildingID)[0] : null;
            if (buildingGroup) {
              floorGroup = buildingGroup.children ? buildingGroup.children.filter((c: any) => c.value === el.floorID)[0] : null;
            }
            if (floorGroup)
              roomGroup = floorGroup.children ? floorGroup.children.filter((c: any) => c.value === el.roomID)[0] : null;
            if (roomGroup)
              locationGroup = roomGroup.children ? roomGroup.children.filter((c: any) => c.value === el.locationCode)[0] : null;

            if (siteGroup && !buildingGroup) {
              siteGroup.buildingArr.push(new TreeviewItem({ text: el.buildingName, value: el.buildingID, checked: false, children: [new TreeviewItem({ text: "", value: 0, checked: false })] }));
            }

            if (buildingGroup && !floorGroup) {
              buildingGroup.children.push(new TreeviewItem({ text: el.floorName, value: el.floorID, checked: false, children: [new TreeviewItem({ text: "", value: 0, checked: false })] }));

            }

            if (floorGroup && !roomGroup) {
              floorGroup.children.push(new TreeviewItem({ text: el.roomName, value: el.roomID, checked: false, children: [(new TreeviewItem({ text: "", value: 0, checked: false }))] }));
            }

            if (roomGroup && !locationGroup && !found) {
              found = true;
              roomGroup.children.push(new TreeviewItem({ text: el.locationName, value: el.locationCode, checked: false }));
            }
          } else {

            if (el.siteID === val.siteID && el.locationID === val.locationID) {
              locationArr.push(new TreeviewItem({ text: el.locationName, value: el.locationCode, checked: false }));
            }
            if (el.siteID === val.siteID && el.roomID === val.roomID && el.locationID === val.locationID) {
              roomArr.push(new TreeviewItem({ text: el.roomName, value: el.roomID, checked: false, children: locationArr }));
            }
            if (el.siteID === val.siteID && el.roomID === val.roomID && el.floorID === val.floorID && el.locationID === val.locationID) {
              floorArr.push(new TreeviewItem({ text: el.floorName, value: el.floorID, checked: false, children: roomArr }));
            }
            if (el.siteID === val.siteID && el.buildingID === val.buildingID && el.floorID === val.floorID && el.roomID === val.roomID && el.locationID === val.locationID) {
              buildingArr.push(new TreeviewItem({ text: el.buildingName, value: el.buildingID, checked: false, children: floorArr }));
            }
          }
        });
        buildingArr.forEach((item: TreeviewItem, i: Number) => {
          item.checked = false;
        });
        return acc.concat({ ...val, buildingArr });
      }, []);
    };

    let locationTree = generateLocationChild(this.locationCodes);
    //console.log(locationTree);

    const filterById = (items: any, id: number) => {
      return items.reduce((accumulator: any, currentValue: any) => {
        if (currentValue.children) {
          const newCurrentValue = filterById(currentValue.children, id)
          currentValue = { ...currentValue, children: newCurrentValue }
        }
        if (currentValue.value !== id) {
          currentValue.checked = false;
          return [...accumulator, currentValue]
        }
        return accumulator
      }, [])
    }

    const filtered = locationTree.map((item: any) => {
      return new TreeviewItem({ text: item.siteName, value: item.siteID, collapsed: false, children: item.buildingArr, checked: false });
    });
    console.log(filtered);
    const removedTree = filtered.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.value === v.value)) === i);
    console.log(removedTree);
    const newTree = filterById(removedTree, 0);


    console.log(newTree);
    const generatedTree = newTree.map((item: any) => {
      return new TreeviewItem({ text: item.text, value: item.value, collapsed: false, children: item.children, checked: false });
    });
    return generatedTree;

  }

  async GetFloorTreeviewItems(floormasterservice: FloormasterService): Promise<TreeviewItem[]> {
    this.floorCodes = await floormasterservice.getFloorMaster();
    const generateLocationChild = (arr: any) => {
      return arr.reduce((acc: any, val: any, ind: any, array: any) => {
        const buildingArr: TreeviewItem[] = [];
        const floorArr: TreeviewItem[] = [];

        var found: boolean = false;
        array.forEach((el: any, i: any) => {
          let siteGroup: any;
          let buildingGroup!: any;
          let floorGroup: any;
          if (acc.some((item: any) => item.siteID === val.siteID)) {
            found = false;
            siteGroup = acc.filter((e: any) => e.siteID === el.siteID)[0];
            buildingGroup = siteGroup ? siteGroup.buildingArr.filter((c: any) => c.value === el.buildingID)[0] : null;
            if (buildingGroup) {
              floorGroup = buildingGroup.children ? buildingGroup.children.filter((c: any) => c.value === el.floorID)[0] : null;
            }

            if (siteGroup && !buildingGroup) {
              siteGroup.buildingArr.push(new TreeviewItem({ text: el.buildingName, value: el.buildingID, checked: false, children: [new TreeviewItem({ text: "", value: 0, checked: false })] }));
            }

            if (buildingGroup && !floorGroup) {
              buildingGroup.children.push(new TreeviewItem({ text: el.floorName, value: el.floorID, checked: false, children: [new TreeviewItem({ text: "", value: 0, checked: false })] }));

            }

            // if (roomGroup && !locationGroup && !found) {
            //   found = true;
            //   roomGroup.children.push(new TreeviewItem({ text: el.locationName, value: el.locationCode, checked: false }));
            // }
          } else {

            // if (el.siteID === val.siteID && el.locationID === val.locationID) {
            //   locationArr.push(new TreeviewItem({ text: el.locationName, value: el.locationCode, checked: false }));
            // }

            if (el.siteID === val.siteID && el.floorID === val.floorID) {
              floorArr.push(new TreeviewItem({ text: el.floorName, value: el.floorID, checked: false }));
            }
            if (el.siteID === val.siteID && el.buildingID === val.buildingID && el.floorID === val.floorID) {
              buildingArr.push(new TreeviewItem({ text: el.buildingName, value: el.buildingID, checked: false, children: floorArr }));
            }
          }
        });

        return acc.concat({ ...val, buildingArr });
      }, []);
    };

    let locationTree = generateLocationChild(this.floorCodes);
    //console.log(locationTree);

    const filterById = (items: any, id: number) => {
      return items.reduce((accumulator: any, currentValue: any) => {
        if (currentValue.children) {
          const newCurrentValue = filterById(currentValue.children, id)
          currentValue = { ...currentValue, children: newCurrentValue }
        }
        if (currentValue.value !== id) {
          currentValue.checked = false;
          return [...accumulator, currentValue]
        }
        return accumulator
      }, [])
    }

    const filtered = locationTree.map((item: any) => {
      return new TreeviewItem({ text: item.siteName, value: item.siteID, collapsed: false, children: item.buildingArr, checked: false });
    });
    const removedTree = filtered.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.value === v.value)) === i);
    const newTree = filterById(removedTree, 0);


    const generatedTree = newTree.map((item: any) => {
      return new TreeviewItem({ text: item.text, value: item.value, collapsed: false, children: item.children, checked: false });
    });
    return generatedTree;

  }

  async GetRoomTreeviewItems(roommasterservice: RoommasterService): Promise<TreeviewItem[]> {
    this.roomCodes = await roommasterservice.getRoomMaster();
    const generateLocationChild = (arr: any) => {
      return arr.reduce((acc: any, val: any, ind: any, array: any) => {
        const roomArr: TreeviewItem[] = [];
        const buildingArr: TreeviewItem[] = [];
        const floorArr: TreeviewItem[] = [];

        var found: boolean = false;
        array.forEach((el: any, i: any) => {
          let siteGroup: any;
          let buildingGroup!: any;
          let floorGroup: any;
          let roomGroup: any;
          if (acc.some((item: any) => item.siteID === val.siteID)) {
            found = false;
            siteGroup = acc.filter((e: any) => e.siteID === el.siteID)[0];
            buildingGroup = siteGroup ? siteGroup.buildingArr.filter((c: any) => c.value === el.buildingID)[0] : null;
            if (buildingGroup) {
              floorGroup = buildingGroup.children ? buildingGroup.children.filter((c: any) => c.value === el.floorID)[0] : null;
            }
            if (floorGroup)
              roomGroup = floorGroup.children ? floorGroup.children.filter((c: any) => c.value === el.roomID)[0] : null;

            if (siteGroup && !buildingGroup) {
              siteGroup.buildingArr.push(new TreeviewItem({ text: el.buildingName, value: el.buildingID, checked: false, children: [new TreeviewItem({ text: "", value: 0, checked: false })] }));
            }

            if (buildingGroup && !floorGroup) {
              buildingGroup.children.push(new TreeviewItem({ text: el.floorName, value: el.floorID, checked: false, children: [new TreeviewItem({ text: "", value: 0, checked: false })] }));

            }

            if (floorGroup && !roomGroup) {
              floorGroup.children.push(new TreeviewItem({ text: el.roomName, value: el.roomID, checked: false, children: [(new TreeviewItem({ text: "", value: 0, checked: false }))] }));
            }


          } else {


            if (el.siteID === val.siteID && el.roomID === val.roomID && el.locationID === val.locationID) {
              roomArr.push(new TreeviewItem({ text: el.roomName, value: el.roomID, checked: false }));
            }
            if (el.siteID === val.siteID && el.roomID === val.roomID && el.floorID === val.floorID && el.locationID === val.locationID) {
              floorArr.push(new TreeviewItem({ text: el.floorName, value: el.floorID, checked: false, children: roomArr }));
            }
            if (el.siteID === val.siteID && el.buildingID === val.buildingID && el.floorID === val.floorID && el.roomID === val.roomID && el.locationID === val.locationID) {
              buildingArr.push(new TreeviewItem({ text: el.buildingName, value: el.buildingID, checked: false, children: floorArr }));
            }
          }
        });
        buildingArr.forEach((item: TreeviewItem, i: Number) => {
          item.checked = false;
        });
        return acc.concat({ ...val, buildingArr });
      }, []);
    };

    let locationTree = generateLocationChild(this.roomCodes);
    //console.log(locationTree);

    const filterById = (items: any, id: number) => {
      return items.reduce((accumulator: any, currentValue: any) => {
        if (currentValue.children) {
          const newCurrentValue = filterById(currentValue.children, id)
          currentValue = { ...currentValue, children: newCurrentValue }
        }
        if (currentValue.value !== id) {
          currentValue.checked = false;
          return [...accumulator, currentValue]
        }
        return accumulator
      }, [])
    }

    const filtered = locationTree.map((item: any) => {
      return new TreeviewItem({ text: item.siteName, value: item.siteID, collapsed: false, children: item.buildingArr, checked: false });
    });
    const removedTree = filtered.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.value === v.value)) === i);
    const newTree = filterById(removedTree, 0);
    const generatedTree = newTree.map((item: any) => {
      return new TreeviewItem({ text: item.text, value: item.value, collapsed: false, children: item.children, checked: false });
    });
    return generatedTree;

  }

}