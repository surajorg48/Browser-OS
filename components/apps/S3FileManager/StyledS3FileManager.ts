import styled from "styled-components";

export const StyledS3FileManager = styled.div`
  background-color: rgb(25 25 25);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  user-select: none;
  width: 100%;
`;

export const StyledS3Toolbar = styled.nav`
  align-items: center;
  background-color: rgb(32 32 32);
  border-bottom: 1px solid rgb(45 45 45);
  display: flex;
  gap: 4px;
  height: 38px;
  padding: 0 8px;
  width: 100%;

  .nav-btn {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: rgb(220 220 220);
    cursor: pointer;
    display: flex;
    height: 28px;
    justify-content: center;
    padding: 0 6px;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;

    svg {
      fill: currentColor;
      height: 14px;
      width: 14px;
    }

    &:hover:not(:disabled) {
      background-color: rgb(50 50 50);
      color: #fff;
    }

    &:active:not(:disabled) {
      background-color: rgb(65 65 65);
    }

    &:disabled {
      color: rgb(110 110 110);
      cursor: default;
    }
  }

  .action-btn {
    align-items: center;
    background: rgb(45 45 45);
    border: 1px solid rgb(60 60 60);
    border-radius: 4px;
    color: rgb(230 230 230);
    cursor: pointer;
    display: inline-flex;
    font-size: 12px;
    gap: 6px;
    height: 26px;
    padding: 0 10px;
    transition: all 0.15s ease;

    svg {
      fill: currentColor;
      height: 13px;
      width: 13px;
    }

    &:hover {
      background-color: rgb(60 60 60);
      border-color: rgb(80 80 80);
      color: #fff;
    }

    &:active {
      background-color: rgb(75 75 75);
    }

    &.primary {
      background: rgb(0 120 212);
      border-color: rgb(0 120 212);
      color: #fff;

      &:hover {
        background: rgb(16 137 232);
      }
    }
  }

  .divider {
    background-color: rgb(55 55 55);
    height: 18px;
    margin: 0 4px;
    width: 1px;
  }
`;

export const StyledS3AddressBarContainer = styled.div`
  align-items: center;
  background-color: rgb(25 25 25);
  border-bottom: 1px solid rgb(40 40 40);
  display: flex;
  gap: 8px;
  height: 34px;
  padding: 0 8px;
  width: 100%;

  .address-box {
    align-items: center;
    background-color: rgb(36 36 36);
    border: 1px solid rgb(50 50 50);
    border-radius: 4px;
    display: flex;
    flex: 1;
    height: 26px;
    overflow: hidden;
    padding: 0 8px;

    .s3-icon {
      color: rgb(255 153 0);
      font-size: 13px;
      margin-right: 6px;
    }

    input {
      background: transparent;
      border: none;
      color: rgb(240 240 240);
      flex: 1;
      font-family: inherit;
      font-size: 12px;
      outline: none;
      width: 100%;
    }
  }

  .search-box {
    align-items: center;
    background-color: rgb(36 36 36);
    border: 1px solid rgb(50 50 50);
    border-radius: 4px;
    display: flex;
    height: 26px;
    padding: 0 8px;
    width: 180px;

    input {
      background: transparent;
      border: none;
      color: rgb(240 240 240);
      font-family: inherit;
      font-size: 12px;
      outline: none;
      width: 100%;

      &::placeholder {
        color: rgb(130 130 130);
      }
    }
  }
`;

export const StyledS3Content = styled.div`
  flex: 1;
  overflow-y: auto;
  position: relative;
  width: 100%;
`;

export const StyledS3FileGrid = styled.ol`
  align-content: flex-start;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fill, 86px);
  grid-template-rows: repeat(auto-fill, 76px);
  gap: 6px;
  height: 100%;
  margin: 0;
  outline: none;
  overflow-y: auto;
  padding: 10px;
  user-select: none;
  width: 100%;

  &.details {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 12px;
  }
`;

export const StyledS3Item = styled.li<{ $isSelected?: boolean }>`
  align-items: center;
  background-color: ${({ $isSelected }) =>
    $isSelected ? "rgba(255, 255, 255, 0.12)" : "transparent"};
  border: 1px solid
    ${({ $isSelected }) => ($isSelected ? "rgba(255, 255, 255, 0.25)" : "transparent")};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6px 4px;
  position: relative;
  text-align: center;
  transition: background-color 0.1s ease;

  &:hover {
    background-color: ${({ $isSelected }) =>
      $isSelected ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.06)"};
  }

  picture {
    display: flex;
    height: 38px;
    justify-content: center;
    margin-bottom: 4px;
    width: 38px;

    img {
      height: 38px;
      object-fit: contain;
      width: 38px;
    }
  }

  span.label {
    color: rgb(240 240 240);
    display: -webkit-box;
    font-size: 11px;
    line-height: 1.2;
    max-width: 78px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;

export const StyledS3ItemRow = styled.li<{ $isSelected?: boolean }>`
  align-items: center;
  background-color: ${({ $isSelected }) =>
    $isSelected ? "rgba(255, 255, 255, 0.12)" : "transparent"};
  border-bottom: 1px solid rgb(38 38 38);
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  height: 28px;
  padding: 0 8px;
  transition: background-color 0.1s ease;

  &:hover {
    background-color: ${({ $isSelected }) =>
      $isSelected ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.05)"};
  }

  .col-icon {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-right: 8px;
    width: 20px;

    img {
      height: 18px;
      width: 18px;
    }
  }

  .col-name {
    color: rgb(240 240 240);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .col-size {
    color: rgb(170 170 170);
    text-align: right;
    width: 90px;
  }

  .col-date {
    color: rgb(150 150 150);
    text-align: right;
    width: 150px;
  }
`;

export const StyledS3StatusBar = styled.footer`
  align-items: center;
  background-color: rgb(32 32 32);
  border-top: 1px solid rgb(42 42 42);
  color: rgb(200 200 200);
  display: flex;
  font-size: 11px;
  height: 24px;
  justify-content: space-between;
  padding: 0 12px;
  width: 100%;

  .status-left {
    display: flex;
    gap: 12px;
  }

  .status-right {
    display: flex;
    gap: 8px;
  }
`;

export const StyledModalOverlay = styled.div`
  align-items: center;
  background: rgba(0, 0, 0, 0.65);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
`;

export const StyledModalDialog = styled.div`
  background: rgb(32 32 32);
  border: 1px solid rgb(60 60 60);
  border-radius: 8px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  flex-direction: column;
  max-width: 92%;
  padding: 20px;
  width: 440px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 14px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;

    label {
      color: rgb(200 200 200);
      font-size: 12px;
    }

    input,
    select {
      background: rgb(22 22 22);
      border: 1px solid rgb(55 55 55);
      border-radius: 4px;
      color: #fff;
      font-family: inherit;
      font-size: 13px;
      padding: 6px 10px;

      &:focus {
        border-color: rgb(0 120 212);
        outline: none;
      }
    }
  }

  .modal-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 16px;

    button {
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      padding: 6px 14px;
      transition: background 0.15s ease;

      &.btn-primary {
        background: rgb(0 120 212);
        color: #fff;

        &:hover {
          background: rgb(16 137 232);
        }
      }

      &.btn-secondary {
        background: rgb(50 50 50);
        color: rgb(220 220 220);

        &:hover {
          background: rgb(65 65 65);
        }
      }

      &.btn-danger {
        background: rgb(180 40 40);
        color: #fff;

        &:hover {
          background: rgb(210 50 50);
        }
      }
    }
  }
`;
